#!/usr/bin/env python3
"""
Pokévendre Pro — Health Monitor
Checks API, site, and DB every 5 minutes.
Logs results and sends alert via cronjob if anything fails.
"""

import json
import sqlite3
import os
import sys
import time
from datetime import datetime
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError

HEALTH_URL = 'https://api.pokevendrepro.com/health'
SITE_URL = 'https://pokevendrepro.com/'
DB_PATH = os.path.expanduser('~/flipmaster-lp/leads.db')
LOG_DIR = os.path.expanduser('~/flipmaster-lp/monitoring')
ALERT_FILE = os.path.join(LOG_DIR, 'last_alert')

MAX_RESPONSE_TIME = 10.0  # seconds
MAX_DB_SIZE_MB = 500

def check_api():
    """Check API health endpoint"""
    try:
        start = time.time()
        req = Request(HEALTH_URL, headers={'User-Agent': 'PokevendreMonitor/1.0'})
        with urlopen(req, timeout=15) as resp:
            elapsed = time.time() - start
            data = json.loads(resp.read().decode())
            if data.get('status') != 'ok':
                return False, f"API status: {data.get('status')}"
            if elapsed > MAX_RESPONSE_TIME:
                return False, f"API slow: {elapsed:.1f}s"
            return True, f"API OK ({elapsed:.2f}s)"
    except Exception as e:
        return False, f"API error: {e}"

def check_site():
    """Check main site is reachable"""
    try:
        start = time.time()
        req = Request(SITE_URL, headers={'User-Agent': 'PokevendreMonitor/1.0'})
        with urlopen(req, timeout=15) as resp:
            elapsed = time.time() - start
            code = resp.status
            if code != 200:
                return False, f"Site HTTP {code}"
            if elapsed > MAX_RESPONSE_TIME:
                return False, f"Site slow: {elapsed:.1f}s"
            return True, f"Site OK ({elapsed:.2f}s, HTTP {code})"
    except Exception as e:
        return False, f"Site error: {e}"

def check_db():
    """Check DB integrity and size"""
    try:
        if not os.path.exists(DB_PATH):
            return False, "DB file missing"
        size_mb = os.path.getsize(DB_PATH) / (1024 * 1024)
        if size_mb > MAX_DB_SIZE_MB:
            return False, f"DB too large: {size_mb:.1f}MB"
        conn = sqlite3.connect(DB_PATH)
        result = conn.execute('PRAGMA integrity_check').fetchone()
        conn.close()
        if result[0] != 'ok':
            return False, f"DB integrity: {result[0]}"
        return True, f"DB OK ({size_mb:.2f}MB)"
    except Exception as e:
        return False, f"DB error: {e}"

def should_alert(errors):
    """Rate-limit alerts: max 1 per hour"""
    if not errors:
        # Clear alert file on success
        if os.path.exists(ALERT_FILE):
            os.remove(ALERT_FILE)
        return True
    if os.path.exists(ALERT_FILE):
        last = os.path.getmtime(ALERT_FILE)
        if time.time() - last < 3600:  # 1 hour cooldown
            return False
    # Write alert timestamp
    os.makedirs(LOG_DIR, exist_ok=True)
    with open(ALERT_FILE, 'w') as f:
        f.write(datetime.now().isoformat())
    return True

def main():
    os.makedirs(LOG_DIR, exist_ok=True)
    log_file = os.path.join(LOG_DIR, 'health.log')

    results = []
    errors = []

    for name, check_fn in [('API', check_api), ('Site', check_site), ('DB', check_db)]:
        ok, msg = check_fn()
        results.append(f"{'✅' if ok else '❌'} {name}: {msg}")
        if not ok:
            errors.append(f"{name}: {msg}")

    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    log_line = f"[{timestamp}] {' | '.join(results)}\n"

    # Append to log
    with open(log_file, 'a') as f:
        f.write(log_line)

    # Keep last 1000 lines
    try:
        with open(log_file, 'r') as f:
            lines = f.readlines()
        if len(lines) > 1000:
            with open(log_file, 'w') as f:
                f.writelines(lines[-1000:])
    except:
        pass

    # Alert if errors (rate-limited)
    if errors and should_alert(errors):
        print(f"🚨 POKÉVENDRE ALERT — {timestamp}")
        for e in errors:
            print(f"  ❌ {e}")
        return 1

    if errors:
        # Errors exist but we're in cooldown
        return 0

    print(f"✅ All checks passed — {timestamp}")
    return 0

if __name__ == '__main__':
    sys.exit(main())