#!/usr/bin/env python3
"""Send all 9 test emails to pokevendreprou@gmail.com via himalaya"""
import subprocess
import re
import sys

GS_FILE = '/home/ubuntu/flipmaster-lp/emails-sequence-v4.gs'
TO = 'pokevendrepro@gmail.com'
FROM = 'pokevendrepro@gmail.com'

with open(GS_FILE, 'r') as f:
    gs_code = f.read()

# Extract accent colors
accents = {}
for m in re.finditer(r"(\d+):\s*'([^']+)'.*?//", gs_code):
    accents[int(m.group(1))] = m.group(2)

# We need to execute the JS to generate HTML. Since we can't run JS directly,
# let's use node to evaluate the functions.
# First, let's create a node script that generates the HTML for each email.

node_script = '''
const fs = require('fs');
const gs = fs.readFileSync('/home/ubuntu/flipmaster-lp/emails-sequence-v4.gs', 'utf8');

// Remove the EMAIL_SCHEDULE var and getSendDate since they use French chars that might cause issues
// Just eval the whole thing
eval(gs);

const prenom = 'Yo';
const results = [];

for (let i = 1; i <= 9; i++) {
  try {
    const email = getEmailHtml(i, prenom, 'test', '#8b5cf6');
    results.push({ num: i, subject: email.subject, html: email.html, text: email.text });
  } catch (e) {
    results.push({ num: i, error: e.message });
  }
}

console.log(JSON.stringify(results, null, 2));
'''

with open('/tmp/gen-emails.js', 'w') as f:
    f.write(node_script)

print("Node script written. Running...")
