#!/usr/bin/env python3
"""Build the complete emails-sequence-v4.gs file"""

output_path = '/home/ubuntu/flipmaster-lp/emails-sequence-v4.gs'

content = ''

# ============================================================
# PART 1: Design system + helpers
# ============================================================
content += '''// ============================================================
// POKÉVENDRE PRO — Séquence Email v4 HTML
// 9 emails avec design HTML inspiré du mail de bienvenue post-quiz
// Palette sombre #0f0f1a + accents par type d'email
// Compatible tous clients email (table-based, inline CSS)
// ============================================================

var FROM_NAME = 'Pokévendre Pro';
var SITE_URL = 'https://pokevendrepro.com';

// ---- COULEURS D'ACCENT PAR EMAIL ----
var ACCENT = {
  1: '#8b5cf6',  // violet — curiosité, mystère
  2: '#f97316',  // orange — annonce, passion
  3: '#3b82f6',  // bleu — structure, méthode
  4: '#4ade80',  // vert — lancement, go
  5: '#facc15',  // ambre — vulnérabilité
  6: '#ef4444',  // rouge — inaction
  7: '#ef4444',  // rouge — countdown
  8: '#dc2626',  // rouge foncé — dernière chance
  9: '#4ade80'   // vert — bienvenue
};

// ---- HELPERS ----
function hexToRgb(hex) {
  var r = parseInt(hex.slice(1, 3), 16);
  var g = parseInt(hex.slice(3, 5), 16);
  var b = parseInt(hex.slice(5, 7), 16);
  return r + ',' + g + ',' + b;
}

// Wrapper HTML commun à tous les emails
function emailShell(accent, subject, previewText, bodyContent) {
  return '<!DOCTYPE html>' +
  '<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>' +
  '<body style="margin:0;padding:0;background:#0f0f1a;font-family:Arial,Helvetica,sans-serif;color:#d1d5db;">' +
  '<div style="display:none;font-size:1px;color:#0f0f1a;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">' + previewText + '</div>' +
  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f1a;min-height:100vh;">' +
  '<tr><td align="center" style="padding:20px 10px;">' +
  '<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#16162a;border:1px solid rgba(255,255,255,0.06);border-radius:16px;overflow:hidden;">' +
  '<tr><td style="background:' + accent + ';height:6px;font-size:0;line-height:0;">&nbsp;</td></tr>' +
  '<tr><td style="padding:24px 40px 8px;text-align:center;"><span style="font-size:20px;font-weight:800;color:#ffffff;letter-spacing:0.5px;">POKÉVENDRE PRO</span></td></tr>' +
  bodyContent +
  '<tr><td style="padding:0 40px;"><div style="border-top:1px solid rgba(255,255,255,0.06);"></div></td></tr>' +
  '<tr><td style="padding:20px 40px 28px;text-align:center;">' +
  '<p style="margin:0;color:#6b7280;font-size:11px;">Pokévendre Pro — Le système de décision pour revendeurs Pokémon</p>' +
  '<p style="margin:4px 0 0;color:#6b7280;font-size:11px;">Tu reçois cet email car tu as complété le quiz sur pokevendrepro.com</p>' +
  '<p style="margin:8px 0 0;color:#6b7280;font-size:11px;"><a href="{{unsubscribe_url}}" style="color:#6b7280;text-decoration:underline;">Se désinscrire</a></p>' +
  '</td></tr>' +
  '</table></td></tr></table></body></html>';
}

function sectionHeading(emoji, title, accent) {
  return '<tr><td style="padding:20px 40px 8px;"><h2 style="margin:0;color:' + accent + ';font-size:13px;text-transform:uppercase;letter-spacing:1.5px;">' + emoji + ' ' + title + '</h2></td></tr>';
}
function paragraph(text) {
  return '<tr><td style="padding:4px 40px;"><p style="margin:0 0 12px;color:#d1d5db;font-size:15px;line-height:1.65;">' + text + '</p></td></tr>';
}
function boldParagraph(text) {
  return '<tr><td style="padding:4px 40px;"><p style="margin:0 0 12px;color:#ffffff;font-size:15px;line-height:1.65;font-weight:700;">' + text + '</p></td></tr>';
}
function highlightBox(text, accent) {
  return '<tr><td style="padding:8px 40px;"><div style="background:rgba(' + hexToRgb(accent) + ',0.08);border:1px solid rgba(' + hexToRgb(accent) + ',0.2);border-radius:12px;padding:20px;"><p style="margin:0;color:#ffffff;font-size:15px;line-height:1.65;font-weight:600;">' + text + '</p></div></td></tr>';
}
function quoteBox(text, accent) {
  return '<tr><td style="padding:8px 40px;"><div style="border-left:3px solid ' + accent + ';padding:12px 20px;background:rgba(' + hexToRgb(accent) + ',0.05);border-radius:0 8px 8px 0;"><p style="margin:0;color:#d1d5db;font-size:14px;line-height:1.6;font-style:italic;">' + text + '</p></div></td></tr>';
}
function ctaButton(text, url, accent) {
  return '<tr><td style="padding:24px 40px;text-align:center;"><a href="' + url + '" style="display:inline-block;background:' + accent + ';color:#000;font-weight:700;font-size:16px;padding:16px 40px;border-radius:12px;text-decoration:none;letter-spacing:0.3px;">' + text + '</a></td></tr>';
}
function separator() {
  return '<tr><td style="padding:0 40px;"><div style="border-top:1px solid rgba(255,255,255,0.06);margin:8px 0;"></div></td></tr>';
}
function spacer(px) {
  return '<tr><td style="padding:0 40px;height:' + px + 'px;font-size:0;line-height:0;">&nbsp;</td></tr>';
}
function psBlock(text) {
  return '<tr><td style="padding:4px 40px;"><p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.5;font-style:italic;">' + text + '</p></td></tr>';
}
function signature() {
  return '<tr><td style="padding:16px 40px 8px;"><p style="margin:0;color:#d1d5db;font-size:15px;">— {sender}</p></td></tr>';
}
function proofCard(name, result, accent) {
  return '<tr><td style="padding:6px 40px;"><div style="background:rgba(' + hexToRgb(accent) + ',0.06);border:1px solid rgba(' + hexToRgb(accent) + ',0.15);border-radius:10px;padding:16px 20px;"><p style="margin:0 0 4px;color:#ffffff;font-size:14px;font-weight:600;">' + name + '</p><p style="margin:0;color:' + accent + ';font-size:14px;font-weight:700;">' + result + '</p></div></td></tr>';
}
function listItem(number, text, accent) {
  return '<tr><td style="padding:4px 40px;"><p style="margin:0 0 8px;color:#d1d5db;font-size:15px;line-height:1.6;"><span style="display:inline-block;width:28px;height:28px;line-height:28px;text-align:center;background:rgba(' + hexToRgb(accent) + ',0.15);border-radius:8px;color:' + accent + ';font-weight:700;font-size:13px;margin-right:8px;">' + number + '</span>' + text + '</p></td></tr>';
}
function checkItem(text) {
  return '<tr><td style="padding:3px 40px;"><p style="margin:0;color:#d1d5db;font-size:14px;line-height:1.6;">\\u2705 ' + text + '</p></td></tr>';
}
function crossItem(text) {
  return '<tr><td style="padding:3px 40px;"><p style="margin:0;color:#6b7280;font-size:14px;line-height:1.6;">\\u274c ' + text + '</p></td></tr>';
}

'''

print(f"Part 1 done: {len(content)} chars")

with open(output_path, 'w') as f:
    f.write(content)

print("Written part 1 to file")
