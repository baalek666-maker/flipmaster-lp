#!/usr/bin/env python3
"""
POKEVENDRE PRO - Evergreen Email Sequence
Each lead gets emails on a relative schedule from their capture date.
J+0 = quiz day (merci email sent immediately by api.py)
J+1 = Email 1, J+8 = Email 2, etc.
"""

import os
import sqlite3
import smtplib
import time
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv

load_dotenv()

DB_PATH = os.path.expanduser('~/flipmaster-lp/leads.db')
GMAIL_USER = 'pokevendrepro@gmail.com'
GMAIL_APP_PASSWORD = os.environ.get('GMAIL_APP_PASSWORD', '')
BASE_URL = 'https://pokevendrepro.com'

# Launch day offset: days between lead capture and access opening (J+N)
LAUNCH_DAY_OFFSET = int(os.environ.get('LAUNCH_DAY_OFFSET', 22))

SEQUENCE = [
    {'num': 1, 'delay_days': 1,                        'subject': "Ta pire erreur en revente",                  'send_hour': 10},
    {'num': 2, 'delay_days': 8,                        'subject': "Pourquoi je lance \u00e7a",                   'send_hour': 10},
    {'num': 3, 'delay_days': 15,                       'subject': "Le chiffre que tu ignores",                  'send_hour': 10},
    {'num': 4, 'delay_days': LAUNCH_DAY_OFFSET,        'subject': "C'est maintenant",                           'send_hour': 9},
    {'num': 5, 'delay_days': LAUNCH_DAY_OFFSET + 3,    'subject': "J'ai perdu 1 200\u20ac",                     'send_hour': 10},
    {'num': 6, 'delay_days': LAUNCH_DAY_OFFSET + 5,    'subject': "La question qui revient tout le temps",      'send_hour': 10},
    {'num': 7, 'delay_days': LAUNCH_DAY_OFFSET + 7,    'subject': "Dernier jour",                               'send_hour': 9},
    {'num': 8, 'delay_days': LAUNCH_DAY_OFFSET + 7,    'subject': "\u00c7a ferme ce soir",                      'send_hour': 19},
]

# === DB FUNCTIONS ===

def init_sequence_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS email_sequence (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        email_num INTEGER NOT NULL,
        sent_at TEXT,
        scheduled_for TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        attempts INTEGER DEFAULT 0,
        UNIQUE(email, email_num)
    )''')
    # Migration: add attempts column if missing (existing DBs)
    try:
        c.execute('ALTER TABLE email_sequence ADD COLUMN attempts INTEGER DEFAULT 0')
    except sqlite3.OperationalError:
        pass
    try:
        c.execute('ALTER TABLE leads ADD COLUMN unsubscribed INTEGER DEFAULT 0')
    except sqlite3.OperationalError:
        pass
    conn.commit()
    conn.close()

def schedule_lead_emails(email, prenom, profil, capture_date_iso):
    """Schedule all 8 sequence emails for a new lead based on their capture date."""
    init_sequence_db()
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    try:
        capture_date = datetime.fromisoformat(capture_date_iso)
    except Exception:
        capture_date = datetime.now(timezone.utc)
    if capture_date.tzinfo is None:
        capture_date = capture_date.replace(tzinfo=timezone.utc)
    for seq in SEQUENCE:
        # J+N at send_hour UTC, not capture_date + N days + send_hour hours
        scheduled = (capture_date + timedelta(days=seq['delay_days'])).replace(
            hour=seq['send_hour'], minute=0, second=0, microsecond=0
        )
        try:
            c.execute(
                'INSERT OR IGNORE INTO email_sequence (email, email_num, scheduled_for, status) VALUES (?,?,?,?)',
                (email, seq['num'], scheduled.isoformat(), 'pending')
            )
        except Exception as e:
            print(f'Schedule error for email {seq["num"]}: {e}')
    conn.commit()
    conn.close()
    print(f'Scheduled 8 emails for {email} starting from J+1')

def get_pending_emails():
    """Return emails that are due to be sent now (excluding unsubscribed).
    Includes 'failed' emails with attempts < MAX_RETRIES for retry.
    Purchased leads are excluded via cancel_purchase_emails() which sets
    their pending emails to status='purchased' — so they naturally won't
    appear here. We DON'T block by purchases table to allow future product
    sequences for existing buyers."""
    init_sequence_db()
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    now = datetime.now(timezone.utc)
    c.execute('''
        SELECT es.id, es.email, es.email_num, es.scheduled_for
        FROM email_sequence es
        JOIN leads l ON es.email = l.email
        WHERE (es.status = 'pending' OR (es.status = 'failed' AND es.attempts < 3))
        AND es.scheduled_for <= ?
        AND COALESCE(l.unsubscribed, 0) = 0
        ORDER BY es.scheduled_for ASC
    ''', (now.isoformat(),))
    rows = c.fetchall()
    conn.close()
    return rows

def mark_email_sent(email_id):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('UPDATE email_sequence SET status = ?, sent_at = ? WHERE id = ?',
              ('sent', datetime.now(timezone.utc).isoformat(), email_id))
    conn.commit()
    conn.close()

MAX_RETRIES = 3

def mark_email_failed(email_id):
    """Increment attempts counter. Set status to 'failed' only after MAX_RETRIES.
    Before MAX_RETRIES, keep as 'pending' so the scheduler retries next tick."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('SELECT attempts FROM email_sequence WHERE id = ?', (email_id,))
    row = c.fetchone()
    attempts = (row[0] or 0) + 1 if row else MAX_RETRIES
    if attempts >= MAX_RETRIES:
        c.execute('UPDATE email_sequence SET status = ?, attempts = ? WHERE id = ?',
                  ('failed', attempts, email_id))
        print(f'🚨 Email #{email_id} PERMANENTLY FAILED after {attempts} attempts')
    else:
        c.execute('UPDATE email_sequence SET status = ?, attempts = ? WHERE id = ?',
                  ('pending', attempts, email_id))
        print(f'⚠️ Email #{email_id} attempt {attempts}/{MAX_RETRIES} failed — will retry')
    conn.commit()
    conn.close()

def unsubscribe_email(email):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('UPDATE leads SET unsubscribed = 1 WHERE email = ?', (email,))
    c.execute("UPDATE email_sequence SET status = 'cancelled' WHERE email = ? AND status = 'pending'", (email,))
    conn.commit()
    conn.close()

def cancel_purchase_emails(email):
    """Cancel all pending nurture emails for a buyer (called after Stripe payment)."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("UPDATE email_sequence SET status = 'purchased' WHERE email = ? AND status = 'pending'", (email,))
    cancelled = c.rowcount
    conn.commit()
    conn.close()
    print(f'🛒 Cancelled {cancelled} pending emails for buyer {email}')
    return cancelled

# === PLACEHOLDER: Email content functions loaded from emails_content.py ===
from emails_content import get_email_content

# === SEND FUNCTION ===

def send_sequence_email(email_id, email, email_num):
    """Send a single sequence email."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('SELECT prenom, profil FROM leads WHERE email = ?', (email,))
    row = c.fetchone()
    conn.close()
    if not row:
        mark_email_failed(email_id)
        return False
    prenom, profil = row[0] or 'toi', row[1] or 'debutant'

    result = get_email_content(email_num, prenom)
    if not result:
        mark_email_failed(email_id)
        return False
    subject = result['subject']
    text_body = result['text']
    html_body = result['html']

    # Replace unsubscribe placeholder
    unsub_url = f'{BASE_URL}/unsubscribe?email={email}'
    html_body = html_body.replace('{{unsubscribe_url}}', unsub_url)
    text_body = text_body.replace('{{unsubscribe_url}}', unsub_url)

    msg = MIMEMultipart('alternative')
    msg['From'] = f'Pok\u00e9vendre Pro <{GMAIL_USER}>'
    msg['To'] = email
    msg['Subject'] = subject
    msg.attach(MIMEText(text_body, 'plain', 'utf-8'))
    msg.attach(MIMEText(html_body, 'html', 'utf-8'))

    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(GMAIL_USER, GMAIL_APP_PASSWORD)
            server.send_message(msg)
        mark_email_sent(email_id)
        print(f'✅ Sent email {email_num} to {email}')
        return True
    except Exception as e:
        print(f'⚠️ Email {email_num} to {email} failed: {e}')
        mark_email_failed(email_id)
        return False

def send_all_pending():
    """Check and send all pending emails that are due."""
    pending = get_pending_emails()
    print(f'Found {len(pending)} pending emails')
    sent = 0
    for email_id, email, email_num, scheduled_for in pending:
        if send_sequence_email(email_id, email, email_num):
            sent += 1
    return sent

# === MAIN: run as standalone for testing ===
if __name__ == '__main__':
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == 'send':
        count = send_all_pending()
        print(f'Sent {count} emails')
    elif len(sys.argv) > 1 and sys.argv[1] == 'pending':
        pending = get_pending_emails()
        for eid, email, num, sched in pending:
            print(f'  #{eid} Email {num} -> {email} (scheduled: {sched})')
    elif len(sys.argv) > 1 and sys.argv[1] == 'schedule':
        # schedule for existing leads that don't have sequence yet
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('SELECT email, prenom, profil, date FROM leads')
        leads = c.fetchall()
        conn.close()
        for email, prenom, profil, date in leads:
            c2 = sqlite3.connect(DB_PATH)
            c2c = c2.cursor()
            c2c.execute('SELECT COUNT(*) FROM email_sequence WHERE email = ?', (email,))
            if c2c.fetchone()[0] == 0:
                schedule_lead_emails(email, prenom, profil, date)
                print(f'Scheduled for {email}')
            c2.close()
    else:
        print('Usage: python email_sequence.py [send|pending|schedule]')