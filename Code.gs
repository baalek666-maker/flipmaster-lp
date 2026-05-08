// ===== POKÉVENDRE PRO — Lead Capture Web App =====
// Version 2.4 — Simplified: no HTML redirect (client handles redirect)

var SHEET_NAME = 'Leads';

var PROFILES = {
  debutant: {
    name: 'Le Débutant Prudent',
    emoji: '🌱',
    color: '#4ade80',
    subject: '🌱 Ton profil Débutant Prudent — Pokévendre Pro',
    preview: 'Découvre ton diagnostic personnalisé pour démarrer en revente Pokémon',
    hero: 'Tu as tout à construire — et c\'est une chance.',
    strengths: ['Frais et ouvert d\'esprit', 'Pas de mauvaises habitudes', 'Énergie disponible'],
    advice: 'Tu as besoin d\'une méthode simple et éprouvée pour faire tes premiers pas en confiance.',
    nextSteps: ['Vérifie tes spams si tu ne vois pas cet email', 'Suis le plan d\'action de ton profil', 'Rejoins la communauté Pokévendre Pro']
  },
  epuise: {
    name: 'Le Revendeur Épuisé',
    emoji: '😫',
    color: '#facc15',
    subject: '😫 Ton profil Revendeur Épuisé — Pokévendre Pro',
    preview: 'Ton diagnostic est prêt : arrête de courir, commence à gagner',
    hero: 'Tu travailles dur… mais pas malin.',
    strengths: ['Expérience terrain réelle', 'Connaissance du marché', 'Résilience prouvée'],
    advice: 'Tu n\'as pas besoin de travailler PLUS. Tu as besoin de système. Automatise, standardise.',
    nextSteps: ['Identifie ta plus grosse perte de temps', 'Applique le framework de décision', 'Passe de side hustle à business']
  },
  cauterise: {
    name: 'Le Cautérisé',
    emoji: '🔥',
    color: '#f87171',
    subject: '🔥 Ton profil Cautérisé — Pokévendre Pro',
    preview: 'Tes pertes sont ta meilleure formation — voici comment les exploiter',
    hero: 'Tu as pris des claques. Mais tu es toujours là.',
    strengths: ['Connaissance des pièges', 'Prudence acquise par l\'expérience', 'Motivation profonde de réussir'],
    advice: 'Tes pertes sont ta meilleure formation. Ce qui te manque, c\'est un cadre pour transformer cette expérience en jugement.',
    nextSteps: ['Arrête de revendre à l\'aveugle', 'Utilise les règles de décision Pokévendre Pro', 'Reconstruis ta confiance étape par étape']
  },
  ambitieux: {
    name: 'L\'Ambitieux',
    emoji: '🚀',
    color: '#a78bfa',
    subject: '🚀 Ton profil Ambitieux — Pokévendre Pro',
    preview: 'Tu as la flamme — maintenant il te faut le carburant',
    hero: 'Tu as la flamme. Maintenant il te faut le carburant.',
    strengths: ['Ambition sans limites', 'Prêt à investir', 'Vision claire de l\'objectif'],
    advice: 'L\'ambition sans structure, c\'est un moteur sans volant. Tu as besoin d\'un système scalable.',
    nextSteps: ['Structure ton processus de revente', 'Automatise les tâches répétitives', 'Passe à l\'échelle avec Pokévendre Pro']
  }
};

function doGet(e) {
  var params = e && e.parameter ? e.parameter : {};
  
  // Health check (no email param)
  if (!params.email) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'Pokévendre Pro — Lead Capture API active',
      version: '2.4'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  // Lead capture
  var prenom = params.prenom || '';
  var email = params.email || '';
  var profil = (params.profil || 'debutant').toLowerCase();
  var q1 = params.q1 || '';
  var q3 = params.q3 || '';
  var q7 = params.q7 || '';
  
  // Save to sheet
  try {
    saveToSheet(prenom, email, profil, q1, q3, q7);
  } catch(err) {
    Logger.log('Sheet save error: ' + err.toString());
  }
  
  // Send welcome email
  try {
    sendWelcomeEmail(prenom, email, profil);
  } catch(err) {
    Logger.log('Email send error: ' + err.toString());
  }
  
  // Return JSON confirmation (client handles redirect)
  return ContentService.createTextOutput(JSON.stringify({
    status: 'ok',
    message: 'Lead captured',
    profil: profil,
    prenom: prenom
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  // Delegate to doGet logic
  var params = {};
  if (e && e.postData && e.postData.contents) {
    try {
      params = JSON.parse(e.postData.contents);
    } catch(err) {
      params = {};
    }
  }
  if (e && e.parameter) {
    for (var key in e.parameter) {
      if (!params[key]) params[key] = e.parameter[key];
    }
  }
  // Build a fake event object
  var fakeEvent = { parameter: params };
  return doGet(fakeEvent);
}

function saveToSheet(prenom, email, profil, q1, q3, q7) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Date', 'Prénom', 'Email', 'Profil', 'Q1_Motivation', 'Q3_Pain', 'Q7_Budget']);
  }
  
  // Check for duplicates by email
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][2] === email) {
      // Update date for existing lead
      sheet.getRange(i + 1, 1).setValue(new Date().toISOString());
      return;
    }
  }
  
  sheet.appendRow([new Date().toISOString(), prenom, email, profil, q1, q3, q7]);
}

function sendWelcomeEmail(prenom, email, profil) {
  var p = PROFILES[profil] || PROFILES.debutant;
  var htmlBody = buildEmailHTML(prenom, profil, p);
  var textBody = buildEmailText(prenom, profil, p);
  
  MailApp.sendEmail({
    to: email,
    subject: p.subject,
    htmlBody: htmlBody,
    body: textBody,
    name: 'Pokévendre Pro'
  });
}

function buildEmailHTML(prenom, profil, p) {
  var rgb = hexToRgb(p.color);
  return '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<style>body{margin:0;padding:0;background:#0f0f1a;font-family:Arial,sans-serif;color:#e2e8f0}a{color:' + p.color + '}</style>' +
    '</head><body>' +
    '<div style="max-width:600px;margin:0 auto;background:#0f0f1a">' +
    '<div style="background:linear-gradient(135deg,' + p.color + ',' + p.color + '88);padding:20px 30px;text-align:center">' +
    '<h1 style="margin:0;color:#0f0f1a;font-size:24px">' + p.emoji + ' ' + p.name + '</h1>' +
    '</div>' +
    '<div style="padding:30px">' +
    '<p style="font-size:18px;color:#fff">Salut ' + prenom + ' !</p>' +
    '<p style="font-size:16px;color:rgba(' + rgb + ',0.9);font-style:italic">' + p.hero + '</p>' +
    '<div style="background:rgba(' + rgb + ',0.1);border:1px solid rgba(' + rgb + ',0.2);border-radius:12px;padding:20px;margin:20px 0">' +
    '<h3 style="color:' + p.color + ';margin:0 0 12px;font-size:14px;text-transform:uppercase">💪 Tes forces</h3>' +
    p.strengths.map(function(s) { return '<p style="margin:6px 0;color:#d1d5db;font-size:14px">✓ ' + s + '</p>'; }).join('') +
    '</div>' +
    '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px;margin:20px 0">' +
    '<h3 style="color:#fff;margin:0 0 12px;font-size:14px">🎯 Ton conseil personnalisé</h3>' +
    '<p style="color:#d1d5db;font-size:14px;line-height:1.6">' + p.advice + '</p>' +
    '</div>' +
    '<div style="text-align:center;margin:30px 0">' +
    '<a href="https://pokevendrepro.com" style="display:inline-block;background:' + p.color + ';color:#0f0f1a;font-weight:bold;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:16px">Découvrir Pokévendre Pro →</a>' +
    '</div>' +
    '<div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:20px;margin-top:20px">' +
    '<h3 style="color:#fff;margin:0 0 12px;font-size:14px">📋 Tes prochaines étapes</h3>' +
    p.nextSteps.map(function(s, i) { return '<p style="margin:8px 0;color:#9ca3af;font-size:14px">' + (i+1) + '. ' + s + '</p>'; }).join('') +
    '</div>' +
    '<div style="text-align:center;margin-top:30px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.05)">' +
    '<p style="color:#6b7280;font-size:12px">Pokévendre Pro — Le système de décision pour revendeurs Pokémon</p>' +
    '</div>' +
    '</div></div></body></html>';
}

function buildEmailText(prenom, profil, p) {
  var text = p.emoji + ' ' + p.name + '\n\n';
  text += 'Salut ' + prenom + ' !\n\n';
  text += p.hero + '\n\n';
  text += '💪 Tes forces :\n';
  p.strengths.forEach(function(s) { text += '  ✓ ' + s + '\n'; });
  text += '\n🎯 Ton conseil :\n' + p.advice + '\n\n';
  text += '📋 Prochaines étapes :\n';
  p.nextSteps.forEach(function(s, i) { text += '  ' + (i+1) + '. ' + s + '\n'; });
  text += '\n→ Découvrir Pokévendre Pro : https://pokevendrepro.com\n\n';
  text += 'Pokévendre Pro — Le système de décision pour revendeurs Pokémon';
  return text;
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? parseInt(result[1],16) + ',' + parseInt(result[2],16) + ',' + parseInt(result[3],16) : '139,92,246';
}