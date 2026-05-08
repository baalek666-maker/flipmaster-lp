#!/usr/bin/env python3
"""
POKÉVENDRE PRO — Lead Capture + Stripe API
Self-hosted Flask API.
- Saves leads to SQLite DB
- Sends welcome/purchase emails via Gmail SMTP
- Stripe Checkout session creation
- Stripe session verification
- Stripe webhook handling
"""

import os
import sqlite3
import smtplib
import json
import re
import hashlib
import uuid
import time
import requests
import stripe
from dotenv import load_dotenv

load_dotenv()
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Flask, request, jsonify
from datetime import datetime, timezone
from email_sequence import schedule_lead_emails, send_all_pending, unsubscribe_email, cancel_purchase_emails, init_sequence_db
from emails_content import build_purchase_email
from datetime import timedelta

app = Flask(__name__)

# CORS headers — restricted to production domains
ALLOWED_ORIGINS = [
    'https://pokevendrepro.com',
    'https://www.pokevendrepro.com',
    'http://localhost:4321',  # local dev
]
@app.after_request
def add_cors(response):
    origin = request.headers.get('Origin', '')
    if origin in ALLOWED_ORIGINS:
        response.headers['Access-Control-Allow-Origin'] = origin
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, X-API-Key'
    return response

# === CONFIG ===
DB_PATH = os.path.expanduser('~/flipmaster-lp/leads.db')
GMAIL_USER = 'pokevendrepro@gmail.com'
GMAIL_APP_PASSWORD = os.environ.get('GMAIL_APP_PASSWORD', '')

# Stripe config
STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY', '')
STRIPE_WEBHOOK_SECRET = os.environ.get('STRIPE_WEBHOOK_SECRET', '')
STRIPE_PRICE_ID = os.environ.get('STRIPE_PRICE_ID', 'price_1TTl2RBN29xndj7qi3db6hLa')  # LIVE mode default

if STRIPE_SECRET_KEY:
    stripe.api_key = STRIPE_SECRET_KEY

# Meta CAPI config
META_PIXEL_ID = '1418087700005184'
META_ACCESS_TOKEN = os.environ.get('META_ACCESS_TOKEN', '')

# Launch day offset: days between lead capture and access opening (J+N)
LAUNCH_DAY_OFFSET = int(os.environ.get('LAUNCH_DAY_OFFSET', 22))
META_CAPI_URL = f'https://graph.facebook.com/v18.0/{META_PIXEL_ID}/events'

# Admin API key for protected endpoints (/leads, /reservations)
ADMIN_API_KEY = os.environ.get('ADMIN_API_KEY', '')

# Rate limiting (simple in-memory)
from collections import defaultdict
_rate_limits = defaultdict(lambda: [])
RATE_LIMIT_WINDOW = 60  # seconds
RATE_LIMIT_MAX = 10     # requests per window per IP

def _rate_limit_check(ip):
    """Simple in-memory rate limiter. Returns True if allowed, False if rate limited."""
    now = time.time()
    # Clean old entries
    _rate_limits[ip] = [t for t in _rate_limits[ip] if now - t < RATE_LIMIT_WINDOW]
    if len(_rate_limits[ip]) >= RATE_LIMIT_MAX:
        return False
    _rate_limits[ip].append(now)
    return True

PROFILES = {
    'debutant': {
        'name': 'Le Débutant Prudent',
        'emoji': '🌱',
        'color': '#4ade80',
        'subject': '🌱 Ton profil Débutant Prudent — Pokévendre Pro',
        'preview': 'Découvre ton diagnostic personnalisé pour démarrer en revente Pokémon',
        'hero': "Tu as tout à construire — et c'est une chance.",
        'strengths': ["Frais et ouvert d'esprit", 'Pas de mauvaises habitudes', 'Énergie disponible'],
        'advice': "Tu as besoin d'une méthode simple et éprouvée pour faire tes premiers pas en confiance.",
        'nextSteps': ["Vérifie tes spams si tu ne vois pas cet email", 'Suis le plan d\'action de ton profil', 'Rejoins la communauté Pokévendre Pro']
    },
    'epuise': {
        'name': 'Le Revendeur Épuisé',
        'emoji': '😫',
        'color': '#facc15',
        'subject': '😫 Ton profil Revendeur Épuisé — Pokévendre Pro',
        'preview': 'Ton diagnostic est prêt : arrête de courir, commence à gagner',
        'hero': 'Tu travailles dur… mais pas malin.',
        'strengths': ['Expérience terrain réelle', 'Connaissance du marché', 'Résilience prouvée'],
        'advice': "Tu n'as pas besoin de travailler PLUS. Tu as besoin de système. Automatise, standardise.",
        'nextSteps': ['Identifie ta plus grosse perte de temps', 'Applique le framework de décision', 'Passe de side hustle à business']
    },
    'cauterise': {
        'name': 'Le Cautérisé',
        'emoji': '🔥',
        'color': '#f87171',
        'subject': '🔥 Ton profil Cautérisé — Pokévendre Pro',
        'preview': 'Tes pertes sont ta meilleure formation — voici comment les exploiter',
        'hero': 'Tu as pris des claques. Mais tu es toujours là.',
        'strengths': ['Connaissance des pièges', "Prudence acquise par l'expérience", 'Motivation profonde de réussir'],
        'advice': "Tes pertes sont ta meilleure formation. Ce qui te manque, c'est un cadre pour transformer cette expérience en jugement.",
        'nextSteps': ["Arrête de revendre à l'aveugle", 'Utilise les règles de décision Pokévendre Pro', 'Reconstruis ta confiance étape par étape']
    },
    'ambitieux': {
        'name': "L'Ambitieux",
        'emoji': '🚀',
        'color': '#a78bfa',
        'subject': '🚀 Ton profil Ambitieux — Pokévendre Pro',
        'preview': 'Tu as la flamme — maintenant il te faut le carburant',
        'hero': 'Tu as la flamme. Maintenant il te faut le carburant.',
        'strengths': ['Ambition sans limites', "Prêt à investir", "Vision claire de l'objectif"],
        'advice': "L'ambition sans structure, c'est un moteur sans volant. Tu as besoin d'un système scalable.",
        'nextSteps': ['Structure ton processus de revente', 'Automatise les tâches répétitives', "Passe à l'échelle avec Pokévendre Pro"]
    }
}

# === DB INIT ===

def send_capi_event(event_name, event_data, user_data=None, event_id=None):
    """Send an event to Meta Conversions API (CAPI).
    
    Args:
        event_name: Meta event name (Lead, InitiateCheckout, Purchase, etc.)
        event_data: dict with event-specific params (value, currency, content_ids, etc.)
        user_data: dict with hashed user data (em, fn, ln, ph, ct, st, zp, country, external_id)
        event_id: unique event ID for deduplication (auto-generated if None)
    """
    if not META_ACCESS_TOKEN:
        print(f'CAPI: skipped {event_name} — no META_ACCESS_TOKEN')
        return
    
    event_id = event_id or str(uuid.uuid4())
    
    # Build user_data with required hashing
    ud = {}
    if user_data:
        for key in ('em', 'fn', 'ln', 'ph', 'ct', 'st', 'zp', 'country', 'external_id', 'fbc', 'fbp'):
            val = user_data.get(key)
            if val:
                # fbc and fbp are Meta click/browser IDs — string, not array, never hashed
                if key in ('fbc', 'fbp'):
                    s = str(val).strip().lower() if isinstance(val, str) else str(val[0]).strip().lower()
                    if s:
                        ud[key] = s
                    continue
                # Normalize to list of strings for hashable fields
                items = val if isinstance(val, list) else [val]
                hashed = []
                for item in items:
                    s = str(item).strip().lower()
                    if not s:
                        continue
                    # If it looks like a SHA-256 hex hash (64 chars), pass through
                    if len(s) == 64 and all(c in '0123456789abcdef' for c in s):
                        hashed.append(s)
                    elif key == 'external_id':
                        hashed.append(hashlib.sha256(s.encode('utf-8')).hexdigest())
                    else:
                        hashed.append(hashlib.sha256(s.encode('utf-8')).hexdigest())
                if hashed:
                    ud[key] = hashed
    
    # Get client IP and user agent from request context (if available)
    client_ip = ''
    client_ua = ''
    try:
        client_ip = request.headers.get('X-Forwarded-For', request.remote_addr or '').split(',')[0].strip()
        client_ua = request.headers.get('User-Agent', '')
    except RuntimeError:
        pass  # Outside request context
    
    if client_ip:
        ud['client_ip_address'] = client_ip
    if client_ua:
        ud['client_user_agent'] = client_ua
    
    payload = {
        'data': [{
            'event_name': event_name,
            'event_time': int(datetime.now(timezone.utc).timestamp()),
            'event_id': event_id,
            'event_source_url': 'https://pokevendrepro.com',
            'action_source': 'website',
            'user_data': ud,
            'custom_data': event_data,
        }],
        'access_token': META_ACCESS_TOKEN,
    }
    
    # Test mode: disabled for production
    # To enable Test Events, set META_TEST_EVENT_CODE env var
    
    try:
        resp = requests.post(META_CAPI_URL, json=payload, timeout=10)
        result = resp.json()
        if resp.status_code == 200 and result.get('events_received'):
            print(f'CAPI: ✅ {event_name} sent (event_id={event_id[:8]}...)')
        else:
            print(f'CAPI: ⚠️ {event_name} response: {resp.status_code} {result}')
    except Exception as e:
        print(f'CAPI: ❌ {event_name} error: {e}')
def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        prenom TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        profil TEXT NOT NULL,
        q1 TEXT DEFAULT '',
        q3 TEXT DEFAULT '',
        q7 TEXT DEFAULT '',
        unsubscribed INTEGER DEFAULT 0,
        q2 TEXT DEFAULT '',
        q4 TEXT DEFAULT '',
        q5 TEXT DEFAULT '',
        q6 TEXT DEFAULT '',
        reserved INTEGER DEFAULT 0,
        reserved_at TEXT DEFAULT NULL
    )''')
    # Add columns for existing DBs
    try:
        c.execute('ALTER TABLE leads ADD COLUMN reserved INTEGER DEFAULT 0')
    except Exception:
        pass
    try:
        c.execute('ALTER TABLE leads ADD COLUMN reserved_at TEXT DEFAULT NULL')
    except Exception:
        pass
    conn.commit()
    conn.close()

init_db()
init_sequence_db()

# === HELPERS ===
def hex_to_rgb(hex_color):
    result = re.match(r'^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$', hex_color, re.I)
    if result:
        return f"{int(result.group(1),16)},{int(result.group(2),16)},{int(result.group(3),16)}"
    return '139,92,246'

def build_email_html(prenom, profil, p):
    rgb = hex_to_rgb(p['color'])
    strengths_html = ''.join(f'<p style="margin:6px 0;color:#d1d5db;font-size:14px">✓ {s}</p>' for s in p['strengths'])
    steps_html = ''.join(f'<p style="margin:8px 0;color:#9ca3af;font-size:14px">{i+1}. {s}</p>' for i, s in enumerate(p['nextSteps']))
    return f'''<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{{margin:0;padding:0;background:#0f0f1a;font-family:Arial,sans-serif;color:#e2e8f0}}a{{color:{p['color']}}}</style>
</head><body>
<div style="max-width:600px;margin:0 auto;background:#0f0f1a">
<div style="background:linear-gradient(135deg,{p['color']},{p['color']}88);padding:20px 30px;text-align:center">
<h1 style="margin:0;color:#0f0f1a;font-size:24px">{p['emoji']} {p['name']}</h1>
</div>
<div style="padding:30px">
<p style="font-size:18px;color:#fff">Salut {prenom} !</p>
<p style="font-size:16px;color:rgba({rgb},0.9);font-style:italic">{p['hero']}</p>
<div style="background:rgba({rgb},0.1);border:1px solid rgba({rgb},0.2);border-radius:12px;padding:20px;margin:20px 0">
<h3 style="color:{p['color']};margin:0 0 12px;font-size:14px;text-transform:uppercase">💪 Tes forces</h3>
{strengths_html}
</div>
<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px;margin:20px 0">
<h3 style="color:#fff;margin:0 0 12px;font-size:14px">🎯 Ton conseil personnalisé</h3>
<p style="color:#d1d5db;font-size:14px;line-height:1.6">{p['advice']}</p>
</div>
<div style="text-align:center;margin:30px 0">
<a href="https://buy.stripe.com/4gM9AScw480n3778sP4gg01" style="display:inline-block;background:{p['color']};color:#0f0f1a;font-weight:bold;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:16px">Précommander Pokévendre Pro →</a>
</div>
<div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:20px;margin-top:20px">
<h3 style="color:#fff;margin:0 0 12px;font-size:14px">📋 Tes prochaines étapes</h3>
{steps_html}
</div>
<div style="text-align:center;margin-top:30px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.05)">
<p style="color:#6b7280;font-size:12px">Pokévendre Pro — Le système de décision pour revendeurs Pokémon</p>
</div>
</div></div></body></html>'''

def build_email_text(prenom, profil, p):
    text = f"{p['emoji']} {p['name']}\n\n"
    text += f"Salut {prenom} !\n\n"
    text += f"{p['hero']}\n\n"
    text += "💪 Tes forces :\n"
    for s in p['strengths']:
        text += f"  ✓ {s}\n"
    text += f"\n🎯 Ton conseil :\n{p['advice']}\n\n"
    text += "📋 Prochaines étapes :\n"
    for i, s in enumerate(p['nextSteps']):
        text += f"  {i+1}. {s}\n"
    text += "\n→ Précommander Pokévendre Pro : https://buy.stripe.com/4gM9AScw480n3778sP4gg01\n\n"
    text += "Pokévendre Pro — Le système de décision pour revendeurs Pokémon"
    return text

def send_email_with_retry(msg, max_retries=2, delay_seconds=5):
    """Send a MIME message via Gmail SMTP with retry logic.
    Returns True on success, False on failure.
    """
    for attempt in range(1, max_retries + 1):
        try:
            with smtplib.SMTP('smtp.gmail.com', 587) as server:
                server.starttls()
                server.login(GMAIL_USER, GMAIL_APP_PASSWORD)
                server.send_message(msg)
            return True
        except Exception as e:
            print(f'⚠️ Email send attempt {attempt}/{max_retries} failed: {e}')
            if attempt < max_retries:
                time.sleep(delay_seconds)
    print(f'🚨 Email send FAILED after {max_retries} attempts to {msg["To"]}')
    return False

def send_welcome_email(prenom, email, profil):
    p = PROFILES.get(profil, PROFILES['debutant'])
    html_body = build_email_html(prenom, profil, p)
    text_body = build_email_text(prenom, profil, p)

    msg = MIMEMultipart('alternative')
    msg['From'] = f'Pokévendre Pro <{GMAIL_USER}>'
    msg['To'] = email
    msg['Subject'] = p['subject']
    msg.attach(MIMEText(text_body, 'plain', 'utf-8'))
    msg.attach(MIMEText(html_body, 'html', 'utf-8'))

    if not send_email_with_retry(msg):
        raise RuntimeError(f'Welcome email failed after retries for {email}')

def get_capture_date(email):
    """Return the lead's original capture date from DB, or None if not found."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    try:
        c.execute('SELECT date FROM leads WHERE email=?', (email,))
        row = c.fetchone()
        return row[0] if row else None
    finally:
        conn.close()

def save_lead(prenom, email, profil, q1, q2, q3, q4, q5, q6, q7):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    now = datetime.now(timezone.utc).isoformat()
    try:
        c.execute('INSERT INTO leads (date, prenom, email, profil, q1, q2, q3, q4, q5, q6, q7) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
                  (now, prenom, email, profil, q1, q2, q3, q4, q5, q6, q7))
        conn.commit()
        return True
    except sqlite3.IntegrityError:
        # Update existing lead
        c.execute('UPDATE leads SET date=?, prenom=?, profil=?, q1=?, q2=?, q3=?, q4=?, q5=?, q6=?, q7=? WHERE email=?',
                  (now, prenom, profil, q1, q2, q3, q4, q5, q6, q7, email))
        conn.commit()
        return False
    finally:
        conn.close()

# === ROUTES ===
@app.route('/')
def index():
    return jsonify({'status': 'ok', 'message': 'Pokévendre Pro — Lead Capture API', 'version': '3.0'})

@app.route('/health')
def health():
    """Health check endpoint — verifies DB, Stripe config, and email config."""
    checks = {}
    ok = True

    # DB check
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('SELECT COUNT(*) FROM leads')
        count = c.fetchone()[0]
        conn.close()
        checks['db'] = {'status': 'ok', 'leads': count}
    except Exception as e:
        checks['db'] = {'status': 'error', 'detail': str(e)}
        ok = False

    # Stripe check
    if STRIPE_SECRET_KEY:
        checks['stripe'] = 'configured'
    else:
        checks['stripe'] = 'missing'
        ok = False

    # Email check
    if GMAIL_APP_PASSWORD:
        checks['email'] = 'configured'
    else:
        checks['email'] = 'missing'
        ok = False

    # Meta CAPI check
    if META_ACCESS_TOKEN:
        checks['meta_capi'] = 'configured'
    else:
        checks['meta_capi'] = 'missing'

    return jsonify({
        'status': 'ok' if ok else 'degraded',
        'version': '3.0',
        'checks': checks,
    }), 200 if ok else 503

@app.route('/capture')
def capture():
    # Rate limiting
    client_ip = request.headers.get('X-Forwarded-For', request.remote_addr or '').split(',')[0].strip()
    if not _rate_limit_check(client_ip):
        return jsonify({'status': 'error', 'message': 'Trop de requêtes. Réessaie dans 1 minute.'}), 429
    prenom = request.args.get('prenom', '')
    email = request.args.get('email', '')
    profil = request.args.get('profil', 'debutant').lower()
    q1 = request.args.get('q1', '')
    q2 = request.args.get('q2', '')
    q3 = request.args.get('q3', '')
    q4 = request.args.get('q4', '')
    q5 = request.args.get('q5', '')
    q6 = request.args.get('q6', '')
    q7 = request.args.get('q7', '')

    if not email:
        return jsonify({'status': 'error', 'message': 'Email requis'}), 400

    # Save lead
    try:
        is_new = save_lead(prenom, email, profil, q1, q2, q3, q4, q5, q6, q7)
    except Exception as e:
        print(f'Save error: {e}')

    # Send email (only for new leads)
    if is_new:
        try:
            send_welcome_email(prenom, email, profil)
        except Exception as e:
            print(f'🚨 Welcome email FAILED for {email}: {e}')

# Schedule evergreen sequence using the actual capture date from DB
    try:
        capture_date = get_capture_date(email) or datetime.now(timezone.utc).isoformat()
        schedule_lead_emails(email, prenom, profil, capture_date)
    except Exception as e:
        print(f'Sequence schedule error: {e}')

    return jsonify({'status': 'ok', 'message': 'Lead captured', 'profil': profil, 'prenom': prenom, 'new': is_new})

@app.route('/reserve', methods=['POST', 'OPTIONS'])
def reserve():
    """Handle reservation (waitlist) from the merci page.
    Saves reservation to DB and sends confirmation email.
    Returns redirect URL for the confirmation page.
    """
    if request.method == 'OPTIONS':
        return '', 204

    # Rate limiting
    client_ip = request.headers.get('X-Forwarded-For', request.remote_addr or '').split(',')[0].strip()
    if not _rate_limit_check(client_ip):
        return jsonify({'status': 'error', 'message': 'Trop de requêtes. Réessaie dans 1 minute.'}), 429

    data = request.get_json(force=True, silent=True) or {}
    # Also support GET for redirect-based flow
    if not data:
        email = request.args.get('email', '').strip()
        prenom = request.args.get('prenom', '').strip()
        profil = request.args.get('profil', 'debutant').lower()
    else:
        email = data.get('email', '').strip()
        prenom = data.get('prenom', '').strip()
        profil = data.get('profil', 'debutant').lower()

    if not email:
        return jsonify({'status': 'error', 'message': 'Email requis'}), 400

    # Save reservation
    try:
        is_new = save_reservation(email, prenom, profil)
    except Exception as e:
        print(f'Reserve save error: {e}')
        is_new = False

    # Send confirmation email (only for new reservations)
    email_sent = False
    if is_new:
        try:
            send_reserve_email(prenom, email, profil)
            email_sent = True
        except Exception as e:
            print(f'🚨 Reserve email FAILED for {email}: {e}')

    # Schedule email sequence using the real capture date (not reservation date)
    try:
        capture_date = get_capture_date(email) or datetime.now(timezone.utc).isoformat()
        schedule_lead_emails(email, prenom, profil, capture_date)
    except Exception as e:
        print(f'Sequence schedule error (reserve): {e}')

    # Calculate days until access (J+N from capture date)
    days_until_access = LAUNCH_DAY_OFFSET
    try:
        capture_date_str = get_capture_date(email)
        if capture_date_str:
            capture_date = datetime.fromisoformat(capture_date_str)
            if capture_date.tzinfo is None:
                capture_date = capture_date.replace(tzinfo=timezone.utc)
            days_since_capture = (datetime.now(timezone.utc) - capture_date).days
            days_until_access = max(0, LAUNCH_DAY_OFFSET - days_since_capture)
    except Exception as e:
        print(f'Could not calculate days_until_access for reserve page: {e}')

    # Meta CAPI: AddToWishlist (reservation = intent signal)
    try:
        capi_user_data = {'em': email}
        if prenom:
            capi_user_data['fn'] = prenom
        send_capi_event('AddToWishlist', {
            'content_name': 'pokevendre_pro_reserve',
            'content_category': 'digital_course',
        }, user_data=capi_user_data, event_id=f'reserve_{email}_{int(datetime.now(timezone.utc).timestamp())}')
    except Exception as e:
        print(f'CAPI AddToWishlist error: {e}')

    # For GET requests, redirect to confirmation page
    if request.method == 'GET':
        from flask import redirect as flask_redirect
        return flask_redirect(f'https://pokevendrepro.com/reserve?prenom={prenom}&profil={profil}&jours={days_until_access}', code=302)

    return jsonify({
        'status': 'ok',
        'message': 'Réservation enregistrée',
        'prenom': prenom,
        'new': is_new,
        'email_sent': email_sent,
        'jours': days_until_access,
        'redirect': f'/reserve?prenom={prenom}&profil={profil}&jours={days_until_access}'
    })


@app.route('/reservations')
def list_reservations():
    """Redirect to /leads (reservations are now a flag on leads). Auth required."""
    provided_key = request.headers.get('X-API-Key', '') or request.args.get('key', '')
    if ADMIN_API_KEY and provided_key != ADMIN_API_KEY:
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 401
    return list_leads()


@app.route('/leads')
def list_leads():
    # Auth required
    provided_key = request.headers.get('X-API-Key', '') or request.args.get('key', '')
    if ADMIN_API_KEY and provided_key != ADMIN_API_KEY:
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 401
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('SELECT id, date, prenom, email, profil, q1, q2, q3, q4, q5, q6, q7, reserved, reserved_at FROM leads ORDER BY id DESC')
    rows = c.fetchall()
    conn.close()
    leads = [{'id': r[0], 'date': r[1], 'prenom': r[2], 'email': r[3], 'profil': r[4], 'q1': r[5], 'q2': r[6], 'q3': r[7], 'q4': r[8], 'q5': r[9], 'q6': r[10], 'q7': r[11], 'reserved': bool(r[12]), 'reserved_at': r[13]} for r in rows]
    return jsonify({'count': len(leads), 'leads': leads})

# === STRIPE ROUTES ===

@app.route('/create-checkout', methods=['POST', 'OPTIONS'])
def create_checkout():
    """Create a Stripe Checkout session and return the URL."""
    if request.method == 'OPTIONS':
        return '', 204

    # Rate limiting
    client_ip = request.headers.get('X-Forwarded-For', request.remote_addr or '').split(',')[0].strip()
    if not _rate_limit_check(client_ip):
        return jsonify({'status': 'error', 'message': 'Trop de requêtes. Réessaie dans 1 minute.'}), 429

    try:
        data = request.get_json(force=True) or {}
        profil = data.get('profil', '')
        prenom = data.get('prenom', '')
        email = data.get('email', '')
        fbc = data.get('fbc', '')
        fbp = data.get('fbp', '')

        session = stripe.checkout.Session.create(
            mode='payment',
            payment_method_types=['card'],
            line_items=[{
                'price': STRIPE_PRICE_ID,
                'quantity': 1,
            }],
            success_url='https://pokevendrepro.com/acces?session_id={CHECKOUT_SESSION_ID}',
            cancel_url='https://pokevendrepro.com/',
            customer_email=email or None,
            metadata={
                'profil': profil,
                'prenom': prenom,
                'source': 'quiz',
                'fbc': fbc,
                'fbp': fbp,
            },
            allow_promotion_codes=True,
            billing_address_collection='auto',
        )

        return jsonify({'url': session.url})
    except Exception as e:
        print(f'Checkout error: {e}')
        return jsonify({'error': str(e)}), 500


@app.route('/verify-session', methods=['POST', 'OPTIONS'])
def verify_session():
    """Verify a Stripe Checkout session after payment."""
    if request.method == 'OPTIONS':
        return '', 204

    try:
        data = request.get_json(force=True) or {}
        session_id = data.get('session_id')

        if not session_id:
            return jsonify({'error': 'Missing session_id'}), 400

        session = stripe.checkout.Session.retrieve(session_id)

        if session.payment_status == 'paid':
            return jsonify({
                'status': 'complete',
                'customer_email': session.customer_details.email if session.customer_details else '',
                'customer_name': session.customer_details.name if session.customer_details else '',
                'amount_total': session.amount_total,
                'currency': session.currency,
                'metadata': session.metadata or {}
            })
        else:
            return jsonify({'status': session.payment_status})
    except Exception as e:
        print(f'Verify error: {e}')
        return jsonify({'error': str(e)}), 500


@app.route('/stripe-webhook', methods=['POST'])
def stripe_webhook():
    """Handle Stripe webhook events."""
    payload = request.data
    sig = request.headers.get('Stripe-Signature', '')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig, STRIPE_WEBHOOK_SECRET
        )
    except Exception as e:
        print(f'Webhook signature error: {e}')
        return jsonify({'error': 'Invalid signature'}), 400

    if event['type'] == 'checkout.session.completed':
        # Parse raw JSON payload to avoid StripeObject quirks
        import json as _json
        event_data = _json.loads(payload.decode('utf-8')) if isinstance(payload, bytes) else _json.loads(payload)
        session = event_data['data']['object']
        customer_details = session.get('customer_details') or {}
        customer_email = customer_details.get('email', '')
        customer_name = customer_details.get('name', '')
        metadata = session.get('metadata') or {}
        profil = metadata.get('profil', '')
        prenom = metadata.get('prenom', '') or (customer_name.split(' ')[0] if customer_name else '')
        session_id = session.get('id', '')

        # Send purchase confirmation email
        try:
            send_purchase_email(prenom, customer_email, profil)
        except Exception as e:
            print(f'Purchase email error: {e}')
            # Don't fail the webhook

        # Save purchase to DB
        try:
            save_purchase(customer_email, prenom, profil, session_id)
        except Exception as e:
            print(f'Save purchase error: {e}')

        # Cancel remaining nurture emails for this buyer
        try:
            cancel_purchase_emails(customer_email)
        except Exception as e:
            print(f'Cancel purchase emails error: {e}')

        # Meta CAPI: Purchase event (server-side)
        try:
            # Build user_data with fn/ln from customer_name + fbc/fbp from metadata
            capi_user_data = {'em': customer_email}
            if customer_name:
                name_parts = customer_name.strip().split(None, 1)
                if name_parts:
                    capi_user_data['fn'] = name_parts[0]
                if len(name_parts) > 1:
                    capi_user_data['ln'] = name_parts[1]
            if metadata.get('fbc'):
                capi_user_data['fbc'] = metadata['fbc']
            if metadata.get('fbp'):
                capi_user_data['fbp'] = metadata['fbp']
            send_capi_event('Purchase', {
                'value': 47,
                'currency': 'EUR',
                'content_name': 'pokevendre_pro_precommande',
                'content_type': 'product',
                'content_ids': [STRIPE_PRICE_ID],
                'num_items': 1,
                'transaction_id': session_id,
            }, user_data=capi_user_data, event_id=f'stripe_{session_id}')
        except Exception as e:
            print(f'CAPI Purchase error: {e}')

    return jsonify({'received': True})


def send_purchase_email(prenom, email, profil):
    """Send adaptive purchase confirmation email.
    Calculates days until access based on lead capture date.
    J+LAUNCH_DAY_OFFSET = launch day. If days_until_access <= 0, access is immediate.
    """
    if not email:
        return

    # Calculate days until access (J+N from capture date)
    days_until_access = LAUNCH_DAY_OFFSET  # default fallback
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('SELECT date FROM leads WHERE email = ?', (email,))
        row = c.fetchone()
        conn.close()
        if row and row[0]:
            capture_date = datetime.fromisoformat(row[0])
            if capture_date.tzinfo is None:
                capture_date = capture_date.replace(tzinfo=timezone.utc)
            now = datetime.now(timezone.utc)
            days_since_capture = (now - capture_date).days
            days_until_access = LAUNCH_DAY_OFFSET - days_since_capture
    except Exception as e:
        print(f'Could not calculate days_until_access: {e}')

    result = build_purchase_email(prenom, days_until_access)
    subject = result['subject']
    text = result['text']
    html = result['html']

    msg = MIMEMultipart('alternative')
    msg['From'] = f'Pokévendre Pro <{GMAIL_USER}>'
    msg['To'] = email
    msg['Subject'] = subject
    msg.attach(MIMEText(text, 'plain', 'utf-8'))
    msg.attach(MIMEText(html, 'html', 'utf-8'))

    if not send_email_with_retry(msg):
        raise RuntimeError(f'Email failed after retries for {email}')


def save_purchase(email, prenom, profil, session_id):
    """Save purchase to a purchases table."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS purchases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        email TEXT NOT NULL,
        prenom TEXT DEFAULT '',
        profil TEXT DEFAULT '',
        session_id TEXT DEFAULT '',
        amount INTEGER DEFAULT 0
    )''')
    now = datetime.now(timezone.utc).isoformat()
    c.execute('INSERT INTO purchases (date, email, prenom, profil, session_id) VALUES (?,?,?,?,?)',
              (now, email, prenom, profil, session_id))
    conn.commit()
    conn.close()


def save_reservation(email, prenom, profil):
    """Mark a lead as reserved in the leads table.
    Returns True if new reservation, False if already reserved."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    now = datetime.now(timezone.utc).isoformat()

    # Check if already reserved
    c.execute('SELECT reserved FROM leads WHERE email = ?', (email,))
    row = c.fetchone()
    if row and row[0] == 1:
        # Already reserved — update timestamp and info
        c.execute('UPDATE leads SET reserved_at=?, prenom=?, profil=? WHERE email=?',
                  (now, prenom, profil, email))
        conn.commit()
        conn.close()
        return False

    # New reservation — set reserve flag
    c.execute('UPDATE leads SET reserved=1, reserved_at=?, prenom=?, profil=? WHERE email=?',
              (now, prenom, profil, email))
    conn.commit()
    conn.close()
    return True


def send_reserve_email(prenom, email, profil):
    """Send reservation confirmation email.
    Calculates days until access based on lead capture date (J+LAUNCH_DAY_OFFSET).
    """
    if not email:
        return

    from emails_content import build_reserve_email

    # Calculate days until access (J+N from capture date)
    days_until_access = LAUNCH_DAY_OFFSET
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('SELECT date FROM leads WHERE email = ?', (email,))
        row = c.fetchone()
        conn.close()
        if row and row[0]:
            capture_date = datetime.fromisoformat(row[0])
            if capture_date.tzinfo is None:
                capture_date = capture_date.replace(tzinfo=timezone.utc)
            now = datetime.now(timezone.utc)
            days_since_capture = (now - capture_date).days
            days_until_access = max(0, LAUNCH_DAY_OFFSET - days_since_capture)
    except Exception as e:
        print(f'Could not calculate days_until_access for reserve: {e}')

    result = build_reserve_email(prenom, days_until_access)
    subject = result['subject']
    text = result['text']
    html = result['html']

    msg = MIMEMultipart('alternative')
    msg['From'] = f'Pokévendre Pro <{GMAIL_USER}>'
    msg['To'] = email
    msg['Subject'] = subject
    msg.attach(MIMEText(text, 'plain', 'utf-8'))
    msg.attach(MIMEText(html, 'html', 'utf-8'))

    if not send_email_with_retry(msg):
        raise RuntimeError(f'Email failed after retries for {email}')


# === CAPI ENDPOINT (server-side events from frontend) ===
@app.route('/capi', methods=['POST'])
def capi_event():
    """Receive events from the frontend and forward to Meta CAPI.
    This allows Lead/InitiateCheckout to be sent server-side
    for better attribution and deduplication with the pixel.
    """
    data = request.get_json(force=True, silent=True) or {}
    event_name = data.get('event_name')
    event_data = data.get('event_data', {})
    user_data = data.get('user_data', {})
    event_id = data.get('event_id')

    if not event_name:
        return jsonify({'status': 'error', 'message': 'event_name required'}), 400

    try:
        send_capi_event(event_name, event_data, user_data, event_id)
        return jsonify({'status': 'ok', 'event': event_name})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


# === UNSUBSCRIBE ROUTE ===
@app.route('/unsubscribe')
def unsubscribe():
    email = request.args.get('email', '')
    if not email:
        return jsonify({'status': 'error', 'message': 'Email requis'}), 400
    try:
        unsubscribe_email(email)
        return jsonify({'status': 'ok', 'message': f'{email} désinscrit avec succès'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


# === SCHEDULER ===
def start_scheduler():
    """Start APScheduler to check and send pending emails every 10 minutes."""
    from apscheduler.schedulers.background import BackgroundScheduler
    scheduler = BackgroundScheduler()
    scheduler.add_job(send_all_pending, 'interval', minutes=10, id='email_sequence')
    scheduler.start()
    print('📧 Email sequence scheduler started (every 10 min)')
    return scheduler


if __name__ == '__main__':
    start_scheduler()
    app.run(host='127.0.0.1', port=5000)