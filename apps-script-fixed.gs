// POKÉVENDRE PRO — Apps Script Web App v2.1
// Capture de leads + Email de bienvenue personnalisé
// Déploiement : Sheet > Extensions > Apps Script > Coller > Déployer > Web App
// Exécuter en tant que : Moi-même | Accès : Tout le monde

var SHEET_NAME = 'Leads';
var FROM_NAME = 'Pokévendre Pro';
var MERCI_URL = 'https://pokevendrepro.com/merci';

var PROFILES = {
  debutant: {
    name: 'Le Débutant Prudent', emoji: '🌱', color: '#4ade80',
    tagline: 'Tu as tout à construire — et c\'est une chance.',
    subject: '🌱 Ton profil Pokévendre Pro est prêt — Découvre ton plan d\'action',
    preview: 'Voici ton diagnostic personnalisé de revendeur Pokémon...',
    strengths: ['Frais et ouvert d\'esprit — pas de mauvaises habitudes', 'Énergie disponible et motivation intacte', 'Prudence naturelle qui te protège des grosses pertes'],
    advice: 'Tu as besoin d\'une méthode simple et éprouvée pour faire tes premiers pas en confiance. Pas besoin de tout savoir avant de commencer — il te faut juste le bon cadre.',
    nextSteps: ['Commence par les boosters à faible risque (Évolution, Astral)', 'Fixe-toi un budget de 20€/semaine maximum au début', 'Suis la règle des 3 vérifications avant chaque achat']
  },
  epuise: {
    name: 'Le Revendeur Épuisé', emoji: '😫', color: '#facc15',
    tagline: 'Tu travailles dur… mais pas malin.',
    subject: '😫 Ton profil Pokévendre Pro est prêt — Il est temps de travailler malin',
    preview: 'Ton diagnostic révèle pourquoi tu t\'épuises sans rentabilité...',
    strengths: ['Expérience terrain réelle du marché', 'Connaissance approfondie des cartes', 'Résilience prouvée — tu n\'as pas abandonné'],
    advice: 'Tu n\'as pas besoin de travailler PLUS. Tu as besoin d\'un système. Automatise, standardise, et chaque heure investie rapportera 3x plus.',
    nextSteps: ['Identifie tes 3 plus grosses pertes de temps et élimine-les', 'Crée un processus de vérification rapide (sous 2 minutes par carte)', 'Fixe un seuil de rentabilité minimum par transaction']
  },
  cauterise: {
    name: 'Le Cautérisé', emoji: '🔥', color: '#f87171',
    tagline: 'Tu as pris des claques. Mais tu es toujours là.',
    subject: '🔥 Ton profil Pokévendre Pro est prêt — Transforme tes pertes en force',
    preview: 'Ton expérience passée est ton plus grand atout...',
    strengths: ['Connaissance des pièges — tu sais ce qui ne marche PAS', 'Prudence acquise par l\'expérience', 'Motivation profonde de réussir — le feu est toujours là'],
    advice: 'Tes pertes sont ta meilleure formation. Ce qui te manque, c\'est un cadre pour transformer cette expérience en jugement. Chaque erreur te rapproche de la bonne décision.',
    nextSteps: ['Fais la liste de tes 5 dernières pertes — identifie le pattern', 'Instaure une règle : jamais plus de 15% de ton budget sur un seul achat', 'Recommence petit avec un focus sur les marges, pas le volume']
  },
  ambitieux: {
    name: 'L\'Ambitieux', emoji: '🚀', color: '#a78bfa',
    tagline: 'Tu as la flamme. Maintenant il te faut le carburant.',
    subject: '🚀 Ton profil Pokévendre Pro est prêt — Passe à l\'échelle supérieure',
    preview: 'Ton ambition mérite un système à la hauteur...',
    strengths: ['Ambition sans limites — tu vois grand', 'Prêt à investir temps et argent', 'Vision claire de l\'objectif : en faire ton activité principale'],
    advice: 'L\'ambition sans structure, c\'est un moteur sans volant. Tu as besoin d\'un système scalable qui passe de side hustle à business sans exploser.',
    nextSteps: ['Structure ton processus : achats, vérification, mise en vente, suivi', 'Installe un tableau de bord de rentabilité par catégorie', 'Prépare ton passage à 500€+ de marge mensuelle avec un plan sur 90 jours']
  }
};

// ===== GET : appelé par le quiz via window.location.href =====
function doGet(e) {
  try {
    var params = e && e.parameter ? e.parameter : {};
    var prenom = params.prenom || '';
    var email = params.email || '';
    var profil = (params.profil || 'debutant').toLowerCase();
    var q1 = params.q1 || '';
    var q3 = params.q3 || '';
    var q7 = params.q7 || '';

    // Health check si pas d'email
    if (!email || email.indexOf('@') === -1) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'ok', message: 'Pokévendre Pro — Lead Capture API active', version: '2.1'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 1. Sauvegarder le lead
    saveToSheet(prenom, email, profil, q1, q3, q7);

    // 2. Envoyer l'email (non bloquant si erreur)
    try { sendWelcomeEmail(prenom, email, profil); }
    catch(mailErr) { Logger.log('ERREUR EMAIL (non bloquante): ' + mailErr.toString()); }

    // 3. Rediriger vers la page merci
    var redirectUrl = MERCI_URL + '?profil=' + encodeURIComponent(profil) + '&prenom=' + encodeURIComponent(prenom);
    return HtmlService.createHtmlOutput('<!DOCTYPE html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=\'' + redirectUrl + '\'"></head><body><p>Redirection...</p><script>window.location.href=\'' + redirectUrl + '\';</script></body></html>').setXFrameMode(HtmlService.XFrameMode.ALLOWALL);

  } catch(err) {
    Logger.log('ERREUR doGet: ' + err.toString());
    var fb = MERCI_URL + '?profil=debutant&prenom=';
    return HtmlService.createHtmlOutput('<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=\'' + fb + '\'"></head><body><script>window.location.href=\'' + fb + '\';</script></body></html>').setXFrameMode(HtmlService.XFrameMode.ALLOWALL);
  }
}

// ===== POST : pour appels API directs =====
function doPost(e) {
  try {
    var raw = '';
    if (e && e.postData && e.postData.contents) raw = e.postData.contents;
    else if (e && e.parameter && e.parameter.data) raw = e.parameter.data;
    if (!raw) {
      return ContentService.createTextOutput(JSON.stringify({status:'error',message:'Aucune donnée reçue'})).setMimeType(ContentService.MimeType.JSON);
    }
    var data = JSON.parse(raw);
    var prenom = data.prenom || '';
    var email = data.email || '';
    var profil = (data.profil || 'debutant').toLowerCase();
    var q1 = data.q1 || '';
    var q3 = data.q3 || '';
    var q7 = data.q7 || '';
    if (!email || email.indexOf('@') === -1) {
      return ContentService.createTextOutput(JSON.stringify({status:'error',message:'Email invalide'})).setMimeType(ContentService.MimeType.JSON);
    }
    saveToSheet(prenom, email, profil, q1, q3, q7);
    try { sendWelcomeEmail(prenom, email, profil); }
    catch(mailErr) { Logger.log('ERREUR EMAIL: ' + mailErr.toString()); }
    return ContentService.createTextOutput(JSON.stringify({status:'ok',message:'Lead enregistré et email envoyé'})).setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    Logger.log('ERREUR doPost: ' + err.toString());
    return ContentService.createTextOutput(JSON.stringify({status:'error',message:'Erreur interne'})).setMimeType(ContentService.MimeType.JSON);
  }
}

// ===== GOOGLE SHEETS =====
function saveToSheet(prenom, email, profil, q1, q3, q7) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Date','Prénom','Email','Profil','Q1 (Expérience)','Q3 (Niveau de douleur)','Q7 (Budget)','Source']);
    sheet.getRange(1,1,1,8).setFontWeight('bold');
  }
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    var emailCol = sheet.getRange(2,3,lastRow-1,1).getValues().flat();
    for (var i = 0; i < emailCol.length; i++) {
      if (emailCol[i] === email) {
        Logger.log('Doublon: ' + email + ' — maj date');
        sheet.getRange(i+2,1).setValue(new Date());
        return;
      }
    }
  }
  sheet.appendRow([new Date(), prenom, email, profil, q1, q3, q7, 'quiz-lp']);
}

// ===== EMAIL DE BIENVENUE =====
function sendWelcomeEmail(prenom, email, profilKey) {
  var p = PROFILES[profilKey] || PROFILES.debutant;
  var htmlBody = buildEmailHTML(prenom, p);
  var textBody = buildEmailText(prenom, p);
  MailApp.sendEmail({ to: email, subject: p.subject, body: textBody, htmlBody: htmlBody, name: FROM_NAME });
}

function buildEmailText(prenom, p) {
  var lines = [];
  lines.push('Salut ' + prenom + ' !');
  lines.push('');
  lines.push('Ton profil Pokévendre Pro est prêt : ' + p.emoji + ' ' + p.name);
  lines.push('');
  lines.push('"' + p.tagline + '"');
  lines.push('');
  lines.push('TES FORCES :');
  p.strengths.forEach(function(s) { lines.push('  ✓ ' + s); });
  lines.push('');
  lines.push('TON DIAGNOSTIC :');
  lines.push(p.advice);
  lines.push('');
  lines.push('TES PROCHAINES ETAPES :');
  p.nextSteps.forEach(function(s, i) { lines.push('  ' + (i+1) + '. ' + s); });
  lines.push('');
  lines.push('PASSE A L\'ACTION :');
  lines.push('Rejoins Pokévendre Pro : https://pokevendrepro.com');
  lines.push('');
  lines.push('A tres vite,');
  lines.push('L\'equipe Pokévendre Pro');
  return lines.join('\n');
}

function buildEmailHTML(prenom, p) {
  return '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>' +
  '<body style="margin:0;padding:0;background:#0f0f1a;font-family:Arial,Helvetica,sans-serif;">' +
  '<div style="display:none;font-size:1px;color:#0f0f1a;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">' + p.preview + '</div>' +
  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f1a;">' +
  '<tr><td align="center" style="padding:20px 10px;">' +
  '<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#1a1a2e;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">' +
  '<tr><td style="background:' + p.color + ';height:6px;font-size:0;line-height:0;">&nbsp;</td></tr>' +
  '<tr><td style="padding:40px 40px 20px 40px;text-align:center;">' +
    '<div style="font-size:48px;margin-bottom:12px;">' + p.emoji + '</div>' +
    '<h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:800;">Salut ' + prenom + ' !</h1>' +
    '<p style="margin:8px 0 0;color:#9ca3af;font-size:14px;">Ton profil Pokévendre Pro est prêt</p>' +
  '</td></tr>' +
  '<tr><td style="padding:0 40px 20px;text-align:center;">' +
    '<div style="display:inline-block;background:rgba(' + hexToRgb(p.color) + ',0.15);border:1px solid rgba(' + hexToRgb(p.color) + ',0.3);border-radius:12px;padding:12px 24px;">' +
      '<span style="font-size:20px;font-weight:800;color:' + p.color + ';">' + p.name + '</span>' +
    '</div>' +
    '<p style="margin:12px 0 0;color:#d1d5db;font-size:14px;font-style:italic;">"' + p.tagline + '"</p>' +
  '</td></tr>' +
  '<tr><td style="padding:0 40px;"><div style="border-top:1px solid rgba(255,255,255,0.06);"></div></td></tr>' +
  '<tr><td style="padding:24px 40px 8px;">' +
    '<h2 style="margin:0 0 12px;color:#4ade80;font-size:13px;text-transform:uppercase;letter-spacing:1px;">💪 Tes forces</h2>' +
    p.strengths.map(function(s) { return '<p style="margin:0 0 8px;color:#d1d5db;font-size:14px;">✓ ' + s + '</p>'; }).join('') +
  '</td></tr>' +
  '<tr><td style="padding:8px 40px;">' +
    '<div style="background:rgba(' + hexToRgb(p.color) + ',0.08);border:1px solid rgba(' + hexToRgb(p.color) + ',0.15);border-radius:12px;padding:20px;">' +
      '<h2 style="margin:0 0 8px;color:' + p.color + ';font-size:13px;text-transform:uppercase;letter-spacing:1px;">🎯 Ton diagnostic</h2>' +
      '<p style="margin:0;color:#d1d5db;font-size:14px;line-height:1.6;">' + p.advice + '</p>' +
    '</div>' +
  '</td></tr>' +
  '<tr><td style="padding:24px 40px 8px;">' +
    '<h2 style="margin:0 0 12px;color:#facc15;font-size:13px;text-transform:uppercase;letter-spacing:1px;">🚀 Tes prochaines étapes</h2>' +
    p.nextSteps.map(function(s, i) { return '<p style="margin:0 0 8px;color:#d1d5db;font-size:14px;"><span style="color:' + p.color + ';font-weight:700;">' + (i+1) + '.</span> ' + s + '</p>'; }).join('') +
  '</td></tr>' +
  '<tr><td style="padding:24px 40px 40px;text-align:center;">' +
    '<a href="https://pokevendrepro.com" style="display:inline-block;background:' + p.color + ';color:#000;font-weight:700;font-size:16px;padding:16px 40px;border-radius:12px;text-decoration:none;">Rejoins Pokévendre Pro →</a>' +
  '</td></tr>' +
  '<tr><td style="padding:0 40px 24px;text-align:center;">' +
    '<div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:16px;">' +
      '<p style="margin:0;color:#6b7280;font-size:11px;">Pokévendre Pro — Le système de décision pour revendeurs Pokémon</p>' +
      '<p style="margin:4px 0 0;color:#6b7280;font-size:11px;">Tu reçois cet email car tu as complété le quiz sur pokevendrepro.com</p>' +
    '</div>' +
  '</td></tr>' +
  '</table>' +
  '</td></tr></table>' +
  '</body></html>';
}

function hexToRgb(hex) {
  var r = parseInt(hex.slice(1, 3), 16);
  var g = parseInt(hex.slice(3, 5), 16);
  var b = parseInt(hex.slice(5, 7), 16);
  return r + ',' + g + ',' + b;
}