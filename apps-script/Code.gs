// ============================================================
// POKÉVENDRE PRO — Apps Script Web App
// Capture de leads + Email de bienvenue personnalisé
// ============================================================
// Déploiement : Sheet > Extensions > Apps Script > Coller > Déployer > Web App
// Exécuter en tant que : Moi-même
// Accès : Tout le monde
// ============================================================

var SHEET_NAME = 'Leads';
var FROM_NAME = 'Pokévendre Pro';

// ---- PROFILS (miroir de quiz.astro / merci.astro) ----
var PROFILES = {
  debutant: {
    name: 'Le Débutant Prudent',
    emoji: '🌱',
    color: '#4ade80',
    tagline: 'Tu as tout à construire — et c\'est une chance.',
    subject: '🌱 Ton profil Pokévendre Pro est prêt — Découvre ton plan d\'action',
    preview: 'Voici ton diagnostic personnalisé de revendeur Pokémon...',
    hero: 'Débutant Prudent',
    strengths: [
      'Frais et ouvert d\'esprit — pas de mauvaises habitudes',
      'Énergie disponible et motivation intacte',
      'Prudence naturelle qui te protège des grosses pertes'
    ],
    advice: 'Tu as besoin d\'une méthode simple et éprouvée pour faire tes premiers pas en confiance. Pas besoin de tout savoir avant de commencer — il te faut juste le bon cadre.',
    nextSteps: [
      'Commence par les boosters à faible risque (Évolution, Astral)',
      'Fixe-toi un budget de 20€/semaine maximum au début',
      'Suis la règle des 3 vérifications avant chaque achat'
    ]
  },
  epuise: {
    name: 'Le Revendeur Épuisé',
    emoji: '😫',
    color: '#facc15',
    tagline: 'Tu travailles dur… mais pas malin.',
    subject: '😫 Ton profil Pokévendre Pro est prêt — Il est temps de travailler malin',
    preview: 'Ton diagnostic révèle pourquoi tu t\'épuises sans rentabilité...',
    hero: 'Revendeur Épuisé',
    strengths: [
      'Expérience terrain réelle du marché',
      'Connaissance approfondie des cartes',
      'Résilience prouvée — tu n\'as pas abandonné'
    ],
    advice: 'Tu n\'as pas besoin de travailler PLUS. Tu as besoin d\'un système. Automatise, standardise, et chaque heure investie rapportera 3x plus.',
    nextSteps: [
      'Identifie tes 3 plus grosses pertes de temps et élimine-les',
      'Crée un processus de vérification rapide (sous 2 minutes par carte)',
      'Fixe un seuil de rentabilité minimum par transaction'
    ]
  },
  cauterise: {
    name: 'Le Cautérisé',
    emoji: '🔥',
    color: '#f87171',
    tagline: 'Tu as pris des claques. Mais tu es toujours là.',
    subject: '🔥 Ton profil Pokévendre Pro est prêt — Transforme tes pertes en force',
    preview: 'Ton expérience passée est ton plus grand atout...',
    hero: 'Cautérisé',
    strengths: [
      'Connaissance des pièges — tu sais ce qui ne marche PAS',
      'Prudence acquise par l\'expérience',
      'Motivation profonde de réussir — le feu est toujours là'
    ],
    advice: 'Tes pertes sont ta meilleure formation. Ce qui te manque, c\'est un cadre pour transformer cette expérience en jugement. Chaque erreur te rapproche de la bonne décision.',
    nextSteps: [
      'Fais la liste de tes 5 dernières pertes — identifie le pattern',
      'Instaure une règle : jamais plus de 15% de ton budget sur un seul achat',
      'Recommence petit avec un focus sur les marges, pas le volume'
    ]
  },
  ambitieux: {
    name: 'L\'Ambitieux',
    emoji: '🚀',
    color: '#a78bfa',
    tagline: 'Tu as la flamme. Maintenant il te faut le carburant.',
    subject: '🚀 Ton profil Pokévendre Pro est prêt — Passe à l\'échelle supérieure',
    preview: 'Ton ambition mérite un système à la hauteur...',
    hero: 'Ambitieux',
    strengths: [
      'Ambition sans limites — tu vois grand',
      'Prêt à investir temps et argent',
      'Vision claire de l\'objectif : en faire ton activité principale'
    ],
    advice: 'L\'ambition sans structure, c\'est un moteur sans volant. Tu as besoin d\'un système scalable qui passe de side hustle à business sans exploser.',
    nextSteps: [
      'Structure ton processus : achats, vérification, mise en vente, suivi',
      'Installe un tableau de bord de rentabilité par catégorie',
      'Prépare ton passage à 500€+ de marge mensuelle avec un plan sur 90 jours'
    ]
  }
};

// ============================================================
// WEB APP ENDPOINT
// ============================================================

function doPost(e) {
  try {
    // Récupérer le body quelle que soit la forme (JSON, text/plain, form-urlencoded)
    var raw = '';
    if (e && e.postData && e.postData.contents) {
      raw = e.postData.contents;
    } else if (e && e.parameter && e.parameter.data) {
      raw = e.parameter.data;
    }
    if (!raw) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Aucune donnée reçue'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    var data = JSON.parse(raw);
    var prenom = data.prenom || '';
    var email = data.email || '';
    var profil = (data.profil || 'debutant').toLowerCase();
    var q1 = data.q1 || '';
    var q3 = data.q3 || '';
    var q7 = data.q7 || '';

    // Validation minimale
    if (!email || email.indexOf('@') === -1) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Email invalide'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 1. Enregistrer dans Google Sheets
    saveToSheet(prenom, email, profil, q1, q3, q7);

    // 2. Envoyer l'email de bienvenue personnalisé
    sendWelcomeEmail(prenom, email, profil);

    return ContentService.createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'Lead enregistré et email envoyé'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    // Logger l'erreur mais ne pas la renvoyer au client
    Logger.log('ERREUR doPost: ' + err.toString());
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Erreur interne'
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Pour les requêtes GET — capture de lead, réservation, OU vérification
function doGet(e) {
  try {
    var p = e && e.parameter ? e.parameter : {};

    // ---- RÉSERVATION (depuis le bouton "Réserver ma place") ----
    if (p.action === 'reserve' && p.email && p.email.indexOf('@') !== -1) {
      var prenom = p.prenom || '';
      var email = p.email;
      var profil = (p.profil || 'debutant').toLowerCase();

      // Marquer comme réservé dans le Sheet
      markReserved(email, prenom, profil);

      // Envoyer l'email de confirmation de réservation
      sendReserveEmail(prenom, email);

      // Rediriger vers la page de confirmation
      var reserveUrl = 'https://pokevendrepro.com/reserve?prenom=' + encodeURIComponent(prenom);
      return HtmlService.createHtmlOutput('<script>window.top.location.href="' + reserveUrl + '";</script>')
        .setXFrameMode(HtmlService.XFrameMode.ALLOWALL);
    }

    // ---- CAPTURE DE LEAD (depuis le quiz) ----
    if (p.email && p.email.indexOf('@') !== -1) {
      var prenom = p.prenom || '';
      var email = p.email;
      var profil = (p.profil || 'debutant').toLowerCase();
      var q1 = p.q1 || '';
      var q3 = p.q3 || '';
      var q7 = p.q7 || '';

      saveToSheet(prenom, email, profil, q1, q3, q7);
      sendWelcomeEmail(prenom, email, profil);

      // Rediriger vers la page merci avec les params du profil
      var merciUrl = 'https://pokevendrepro.com/merci?profil=' + encodeURIComponent(profil) + '&prenom=' + encodeURIComponent(prenom);
      return HtmlService.createHtmlOutput('<script>window.top.location.href="' + merciUrl + '";</script>')
        .setXFrameMode(HtmlService.XFrameMode.ALLOWALL);
    }
  } catch (err) {
    Logger.log('ERREUR doGet: ' + err.toString());
  }

  // Vérification simple que le script est en ligne
  return ContentService.createTextOutput(JSON.stringify({
    status: 'ok',
    message: 'Pokévendre Pro — Lead Capture API active',
    version: '2.2'
  })).setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
// GOOGLE SHEETS
// ============================================================

function saveToSheet(prenom, email, profil, q1, q3, q7) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  // Créer la feuille si elle n'existe pas
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Date', 'Prénom', 'Email', 'Profil', 'Q1 (Expérience)', 'Q3 (Niveau de douleur)', 'Q7 (Budget)', 'Source'
    ]);
    // Gras sur les en-têtes
    sheet.getRange(1, 1, 1, 8).setFontWeight('bold');
  }

  // Vérifier doublon par email (ne pas re-enregistrer)
  var emailCol = sheet.getRange(2, 3, sheet.getLastRow() - 1, 1).getValues().flat();
  for (var i = 0; i < emailCol.length; i++) {
    if (emailCol[i] === email) {
      Logger.log('Doublon détecté pour ' + email + ' — mise à jour uniquement');
      // Mettre à jour la date du dernier passage
      sheet.getRange(i + 2, 1).setValue(new Date());
      return;
    }
  }

  sheet.appendRow([
    new Date(),
    prenom,
    email,
    profil,
    q1,
    q3,
    q7,
    'quiz-lp'
  ]);
}

// ============================================================
// EMAIL DE BIENVENUE PERSONNALISÉ
// ============================================================

function sendWelcomeEmail(prenom, email, profilKey) {
  var p = PROFILES[profilKey] || PROFILES.debutant;

  var htmlBody = buildEmailHTML(prenom, p);
  var textBody = buildEmailText(prenom, p);

  MailApp.sendEmail({
    to: email,
    from: FROM_NAME,
    subject: p.subject,
    body: textBody,
    htmlBody: htmlBody,
    name: FROM_NAME
  });
}

function buildEmailText(prenom, p) {
  var lines = [];
  lines.push('Salut ' + prenom + ' !');
  lines.push('');
  lines.push('Ton profil Pokévendre Pro est prêt : ' + p.emoji + ' ' + p.name);
  lines.push('');
  lines.push('"' + p.tagline + '"');
  lines.push('');
  lines.push('── TES FORCES ──');
  p.strengths.forEach(function(s) { lines.push('  ✓ ' + s); });
  lines.push('');
  lines.push('── TON DIAGNOSTIC ──');
  lines.push(p.advice);
  lines.push('');
  lines.push('── TES PROCHAINES ÉTAPES ──');
  p.nextSteps.forEach(function(s, i) { lines.push('  ' + (i + 1) + '. ' + s); });
  lines.push('');
  lines.push('── PASSE À L\'ACTION ──');
  lines.push('Rejoins Pokévendre Pro et transforme ta façon de revendre :');
  lines.push('https://pokevendrepro.com');
  lines.push('');
  lines.push('À très vite,');
  lines.push('L\'équipe Pokévendre Pro');
  return lines.join('\n');
}

function buildEmailHTML(prenom, p) {
  return '<!DOCTYPE html>' +
  '<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>' +
  '<body style="margin:0;padding:0;background:#0f0f1a;font-family:Arial,Helvetica,sans-serif;">' +

  // Preheader
  '<div style="display:none;font-size:1px;color:#0f0f1a;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">' +
    p.preview +
  '</div>' +

  // Wrapper
  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f1a;">' +
  '<tr><td align="center" style="padding:20px 10px;">' +

  // Main card
  '<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#1a1a2e;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">' +

  // Header bar (profil color)
  '<tr><td style="background:' + p.color + ';height:6px;font-size:0;line-height:0;">&nbsp;</td></tr>' +

  // Emoji + Greeting
  '<tr><td style="padding:40px 40px 20px 40px;text-align:center;">' +
    '<div style="font-size:48px;margin-bottom:12px;">' + p.emoji + '</div>' +
    '<h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:800;">Salut ' + prenom + ' !</h1>' +
    '<p style="margin:8px 0 0;color:#9ca3af;font-size:14px;">Ton profil Pokévendre Pro est prêt</p>' +
  '</td></tr>' +

  // Profile name
  '<tr><td style="padding:0 40px 20px;text-align:center;">' +
    '<div style="display:inline-block;background:rgba(' + hexToRgb(p.color) + ',0.15);border:1px solid rgba(' + hexToRgb(p.color) + ',0.3);border-radius:12px;padding:12px 24px;">' +
      '<span style="font-size:20px;font-weight:800;color:' + p.color + ';">' + p.name + '</span>' +
    '</div>' +
    '<p style="margin:12px 0 0;color:#d1d5db;font-size:14px;font-style:italic;">"' + p.tagline + '"</p>' +
  '</td></tr>' +

  // Separator
  '<tr><td style="padding:0 40px;"><div style="border-top:1px solid rgba(255,255,255,0.06);"></div></td></tr>' +

  // Strengths
  '<tr><td style="padding:24px 40px 8px;">' +
    '<h2 style="margin:0 0 12px;color:#4ade80;font-size:13px;text-transform:uppercase;letter-spacing:1px;">💪 Tes forces</h2>' +
    p.strengths.map(function(s) {
      return '<p style="margin:0 0 8px;color:#d1d5db;font-size:14px;">✓ ' + s + '</p>';
    }).join('') +
  '</td></tr>' +

  // Diagnosis
  '<tr><td style="padding:8px 40px;">' +
    '<div style="background:rgba(' + hexToRgb(p.color) + ',0.08);border:1px solid rgba(' + hexToRgb(p.color) + ',0.15);border-radius:12px;padding:20px;">' +
      '<h2 style="margin:0 0 8px;color:' + p.color + ';font-size:13px;text-transform:uppercase;letter-spacing:1px;">🎯 Ton diagnostic</h2>' +
      '<p style="margin:0;color:#d1d5db;font-size:14px;line-height:1.6;">' + p.advice + '</p>' +
    '</div>' +
  '</td></tr>' +

  // Next steps
  '<tr><td style="padding:24px 40px 8px;">' +
    '<h2 style="margin:0 0 12px;color:#facc15;font-size:13px;text-transform:uppercase;letter-spacing:1px;">🚀 Tes prochaines étapes</h2>' +
    p.nextSteps.map(function(s, i) {
      return '<p style="margin:0 0 8px;color:#d1d5db;font-size:14px;"><span style="color:' + p.color + ';font-weight:700;">' + (i + 1) + '.</span> ' + s + '</p>';
    }).join('') +
  '</td></tr>' +

  // CTA
  '<tr><td style="padding:24px 40px 40px;text-align:center;">' +
    '<a href="https://pokevendrepro.com" style="display:inline-block;background:' + p.color + ';color:#000;font-weight:700;font-size:16px;padding:16px 40px;border-radius:12px;text-decoration:none;">Rejoins Pokévendre Pro →</a>' +
  '</td></tr>' +

  // Footer
  '<tr><td style="padding:0 40px 24px;text-align:center;">' +
    '<div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:16px;">' +
      '<p style="margin:0;color:#6b7280;font-size:11px;">Pokévendre Pro — Le système de décision pour revendeurs Pokémon</p>' +
      '<p style="margin:4px 0 0;color:#6b7280;font-size:11px;">Tu reçois cet email car tu as complété le quiz sur pokevendrepro.com</p>' +
    '</div>' +
  '</td></tr>' +

  // End card
  '</table>' +

  // End wrapper
  '</td></tr></table>' +
  '</body></html>';
}

// Util : convertir hex (#4ade80) en "74,222,128"
function hexToRgb(hex) {
  var r = parseInt(hex.slice(1, 3), 16);
  var g = parseInt(hex.slice(3, 5), 16);
  var b = parseInt(hex.slice(5, 7), 16);
  return r + ',' + g + ',' + b;
}

// ============================================================
// RÉSERVATION (depuis "Réserver ma place")
// ============================================================

function markReserved(email, prenom, profil) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    Logger.log('Feuille Leads introuvable pour markReserved');
    return;
  }

  // Vérifier si la colonne "Réservé" existe (colonne 9), sinon la créer
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var reserveCol = headers.indexOf('Réservé');
  if (reserveCol === -1) {
    // Ajouter la colonne Réservé
    var nextCol = sheet.getLastColumn() + 1;
    sheet.getRange(1, nextCol).setValue('Réservé');
    sheet.getRange(1, nextCol).setFontWeight('bold');
    reserveCol = nextCol - 1; // 0-indexed
  }
  var reserveColNum = reserveCol + 1; // 1-indexed pour getRange

  // Chercher la ligne du lead par email
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    // Pas de lead existant — créer une ligne
    sheet.appendRow([
      new Date(), prenom, email, profil, '', '', '', 'quiz-lp', 'TRUE'
    ]);
    return;
  }

  var emailCol = sheet.getRange(2, 3, lastRow - 1, 1).getValues().flat();
  for (var i = 0; i < emailCol.length; i++) {
    if (emailCol[i] === email) {
      // Marquer comme réservé
      sheet.getRange(i + 2, reserveColNum).setValue('TRUE');
      Logger.log('Lead ' + email + ' marqué comme réservé');
      return;
    }
  }

  // Lead pas trouvé — créer une nouvelle ligne avec réservé=TRUE
  sheet.appendRow([
    new Date(), prenom, email, profil, '', '', '', 'quiz-lp', 'TRUE'
  ]);
}

function sendReserveEmail(prenom, email) {
  // Calculer days_until_access : J+22 depuis la capture du lead
  var daysUntilAccess = 22;

  // Essayer de récupérer la date de capture depuis le Sheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (sheet && sheet.getLastRow() > 1) {
    var emailCol = sheet.getRange(2, 3, sheet.getLastRow() - 1, 1).getValues().flat();
    for (var i = 0; i < emailCol.length; i++) {
      if (emailCol[i] === email) {
        var dateCell = sheet.getRange(i + 2, 1).getValue();
        if (dateCell && dateCell.getTime) {
          var daysSinceCapture = Math.floor((new Date() - dateCell) / (1000 * 60 * 60 * 24));
          daysUntilAccess = Math.max(1, 22 - daysSinceCapture);
        }
        break;
      }
    }
  }

  var subject = '✅ Confirmation — Ton accès arrive dans ' + daysUntilAccess + ' jour' + (daysUntilAccess === 1 ? '' : 's');
  var htmlBody = buildReserveEmailHTML(prenom, daysUntilAccess);
  var textBody = buildReserveEmailText(prenom, daysUntilAccess);

  MailApp.sendEmail({
    to: email,
    from: FROM_NAME,
    subject: subject,
    body: textBody,
    htmlBody: htmlBody,
    name: FROM_NAME
  });
}

function buildReserveEmailText(prenom, daysUntilAccess) {
  var lines = [];
  lines.push("Salut " + prenom + " !");
  lines.push("");
  lines.push("C'est confirmé. Ta place est réservée.");
  lines.push("");
  lines.push("Ton accès ouvre dans " + daysUntilAccess + " jour" + (daysUntilAccess === 1 ? '' : 's') + ".");
  lines.push("");
  lines.push("En attendant, fais ça :");
  lines.push("- Ouvre Vinted et repère 3 cartes qui t'intéressent");
  lines.push("- Regarde les prix de vente ET les frais — note-le");
  lines.push("- Identifie 1 carte en dessous du prix marché");
  lines.push("");
  lines.push("Le jour J, tu sauras exactement si cette carte vaut le coup. Le calculateur te le dira en 30 secondes.");
  lines.push("");
  lines.push("On se retrouve dans " + daysUntilAccess + " jour" + (daysUntilAccess === 1 ? '' : 's') + ".");
  lines.push("");
  lines.push("— Jean, community manager à Pokévendre Pro");
  return lines.join('\n');
}

function buildReserveEmailHTML(prenom, daysUntilAccess) {
  var a = '#4ade80'; // vert
  return '<!DOCTYPE html>' +
  '<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>' +
  '<body style="margin:0;padding:0;background:#0f0f1a;font-family:Arial,Helvetica,sans-serif;">' +

  // Preheader
  '<div style="display:none;font-size:1px;color:#0f0f1a;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">' +
    'Précommande confirmée. Prépare-toi.' +
  '</div>' +

  // Wrapper
  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f1a;">' +
  '<tr><td align="center" style="padding:20px 10px;">' +

  // Main card
  '<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#1a1a2e;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">' +

  // Header bar (green)
  '<tr><td style="background:#4ade80;height:6px;font-size:0;line-height:0;">&nbsp;</td></tr>' +

  // Confirmation
  '<tr><td style="padding:40px 40px 8px;"><p style="margin:0;font-size:22px;color:#ffffff;font-weight:800;">✅ C\'est confirmé, ' + prenom + '.</p></td></tr>' +
  '<tr><td style="padding:8px 40px;"><p style="margin:0;color:#d1d5db;font-size:15px;line-height:1.7;">Tu as pris la meilleure décision pour ta revente. Pas de doute possible.</p></td></tr>' +

  // Days countdown
  '<tr><td style="padding:16px 40px;"><div style="background:rgba(74,222,128,0.08);border:1px solid rgba(74,222,128,0.2);border-radius:12px;padding:20px;text-align:center;">' +
    '<p style="margin:0 0 4px;color:#4ade80;font-size:14px;text-transform:uppercase;letter-spacing:1px;">Ton accès ouvre dans</p>' +
    '<p style="margin:0;color:#ffffff;font-size:36px;font-weight:800;">' + daysUntilAccess + ' jour' + (daysUntilAccess === 1 ? '' : 's') + '</p>' +
  '</div></td></tr>' +

  // Action items
  '<tr><td style="padding:24px 40px 8px;">' +
    '<h2 style="margin:0 0 12px;color:#4ade80;font-size:13px;text-transform:uppercase;letter-spacing:1px;">🎯 En attendant, fais ça</h2>' +
  '</td></tr>' +
  '<tr><td style="padding:8px 40px;"><p style="margin:0 0 12px;color:#d1d5db;font-size:15px;line-height:1.7;">Pas la peine d\'attendre sans rien faire. Voici ce que tu peux faire dès maintenant :</p></td></tr>' +
  '<tr><td style="padding:4px 40px;"><p style="margin:0 0 8px;color:#d1d5db;font-size:14px;">✓ Ouvre Vinted et repère 3 cartes Pokémon qui t\'intéressent</p></td></tr>' +
  '<tr><td style="padding:4px 40px;"><p style="margin:0 0 8px;color:#d1d5db;font-size:14px;">✓ Regarde les prix de vente ET les frais — note-le</p></td></tr>' +
  '<tr><td style="padding:4px 40px;"><p style="margin:0 0 8px;color:#d1d5db;font-size:14px;">✓ Identifie 1 carte en dessous du prix marché — tu auras un avantage le jour J</p></td></tr>' +

  // Tip
  '<tr><td style="padding:16px 40px;"><div style="background:rgba(74,222,128,0.06);border:1px solid rgba(74,222,128,0.12);border-radius:10px;padding:16px 20px;">' +
    '<p style="margin:0;color:#9ca3af;font-size:14px;line-height:1.6;">💡 Le jour où tu auras accès, tu sauras exactement si cette carte vaut le coup. Le calculateur te le dira en 30 secondes.</p>' +
  '</div></td></tr>' +

  // Closing
  '<tr><td style="padding:20px 40px 8px;"><p style="margin:0;color:#d1d5db;font-size:15px;line-height:1.7;">On se retrouve dans ' + daysUntilAccess + ' jour' + (daysUntilAccess === 1 ? '' : 's') + '.</p></td></tr>' +
  '<tr><td style="padding:8px 40px;"><p style="margin:0;color:#9ca3af;font-size:14px;">— Jean, community manager à Pokévendre Pro</p></td></tr>' +

  // Footer
  '<tr><td style="padding:0 40px 24px;text-align:center;">' +
    '<div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:16px;">' +
      '<p style="margin:0;color:#6b7280;font-size:11px;">Pokévendre Pro — Le système de décision pour revendeurs Pokémon</p>' +
      '<p style="margin:4px 0 0;color:#6b7280;font-size:11px;">Tu reçois cet email car tu as réservé ta place sur pokevendrepro.com</p>' +
    '</div>' +
  '</td></tr>' +

  // End card
  '</table>' +

  // End wrapper
  '</td></tr></table>' +
  '</body></html>';
}