#!/usr/bin/env python3
"""
Pokévendre Pro — DB Backup Script
Runs daily via cron, keeps 30 days of backups
Uses Python sqlite3 for safe backup (no sqlite3 CLI needed)
"""

import sqlite3
import shutil
import os
import gzip
import time
from datetime import datetime, timedelta

DB_PATH = os.path.expanduser('~/flipmaster-lp/leads.db')
BACKUP_DIR = os.path.expanduser('~/flipmaster-lp/backups')
RETENTION_DAYS = 30
TIMESTAMP = datetime.now().strftime('%Y%m%d_%H%M%S')
BACKUP_FILE = os.path.join(BACKUP_DIR, f'leads_{TIMESTAMP}.db.gz')

def main():
    os.makedirs(BACKUP_DIR, exist_ok=True)

    if not os.path.exists(DB_PATH):
        print(f'ERROR: {DB_PATH} not found')
        return 1

    # Integrity check
    conn = sqlite3.connect(DB_PATH)
    result = conn.execute('PRAGMA integrity_check').fetchone()
    if result[0] != 'ok':
        print(f'ERROR: DB integrity check failed: {result[0]}')
        conn.close()
        return 1
    print('DB integrity: OK')
    conn.close()

    # Copy to temp file (safe: DB not locked during copy since WAL mode)
    temp_backup = os.path.join(BACKUP_DIR, f'leads_{TIMESTAMP}.db')
    shutil.copy2(DB_PATH, temp_backup)

    # Compress
    with open(temp_backup, 'rb') as f_in:
        with gzip.open(BACKUP_FILE, 'wb') as f_out:
            shutil.copyfileobj(f_in, f_out)

    os.remove(temp_backup)

    backup_size = os.path.getsize(BACKUP_FILE)
    print(f'OK: {BACKUP_FILE} ({backup_size} bytes)')

    # Delete old backups
    cutoff = time.time() - (RETENTION_DAYS * 86400)
    deleted = 0
    for fname in os.listdir(BACKUP_DIR):
        fpath = os.path.join(BACKUP_DIR, fname)
        if fname.startswith('leads_') and fname.endswith('.db.gz'):
            if os.path.getmtime(fpath) < cutoff:
                os.remove(fpath)
                deleted += 1
                print(f'Deleted old backup: {fname}')

    if deleted:
        print(f'Cleaned up {deleted} old backup(s)')
    print(f'Backup complete: {datetime.now()}')
    return 0

if __name__ == '__main__':
    exit(main())