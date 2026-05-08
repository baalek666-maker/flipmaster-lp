// Pokévendre Pro — Lead Capture v3.0
// Web App : capture lead → Sheet + email bienvenue → redirect /merci

var SHEET_ID = '1RZQ-bIVinaWb_TQt4el4H2jig1AF4Mser1vEo4jqy6w';
var SHEET_NAME = 'Feuille 1';
var FROM_NAME = 'Pokévendre Pro';
var MERCI_URL = 'https://pokevendrepro.com/merci';

var PROFILES = {
  debutant: {
    name: 'Le Débutant Prudent',
    emoji: '🌱',
    color: '#4ade80',
    tagline: 'Tu as tout à construire — et c\'est une chance.',
    subject: '🌱 Ton profil Pokévendre Pro est prêt — Découvre ton plan d\'action',
    preview: 'Voici ton diagnostic personnalisé de revendeur Pokémon...',
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
    name: 'Le Revendeur Cautérisé',
    emoji: '🔥',
    color: '#f97316',
    tagline: 'Tu as pris des coups… mais tu n\'as pas dit ton dernier mot.',
    subject: '🔥 Ton profil Pokévendre Pro est prêt — Transforme tes blessures en force',
    preview: 'Ton diagnostic montre que tu as le potentiel, mais il te manque la méthode...',
    strengths: [
      'Tu connais les pièges — tu ne les referas pas',
      'Intuition affûtée par l\'expérience',
      'Détermination silencieuse — tu veux prouver que tu peux y arriver'
    ],
    advice: 'Tu es à un croisement. Soit tu continues à brûler du cash par fierté, soit tu adoptes une méthode qui te protège tout en te faisant gagner. Le choix est simple.',
    nextSteps: [
      'Arrête les achats impulsifs — impose-toi un délai de 24h',
      'Analyse tes 5 dernières transactions : qu\'est-ce qui cloche ?',
      'Commence par la méthode de vérification Pokévendre Pro'
    ]
  },
  ambitieux: {
    name: 'Le Revendeur Ambitieux',
    emoji: '🚀',
    color: '#8b5cf6',
    tagline: 'Tu as le potentiel — il te faut le système.',
    subject: '🚀 Ton profil Pokévendre Pro est prêt — Passe au niveau supérieur',
    preview: 'Ton diagnostic révèle un potentiel inexploité...',
    strengths: [
      'Vision claire de tes objectifs',
      'Capacité d\'investissement disponible',
      'Tu cherches déjà à optimiser — c\'est rare'
    ],
    advice: 'Tu es le profil qui a le plus à gagner d\'un système structuré. Pas besoin de te convaincre — tu as juste besoin du bon framework pour passer de "bonnes affaires" à "business rentable".',
    nextSteps: [
      'Structure ton suivi financier (tableur ou app dédiée)',
      'Diversifie tes sources d\'approvisionnement',
      'Applique la méthode de scoring des cartes Pokévendre Pro'
    ]
  }
};

function doGet(e) {
  try {
    var params = e && e.parameter ? e.parameter : {};

    // Health check
    if (!params.email) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'ok',
        message: 'Pokévendre Pro — Lead Capture API active',
        version: '3.0'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var prenom = params.prenom || '';
    var email = params.email.trim().toLowerCase();
    var profil = params.profil || 'debutant';
    var q1 = params.q1 || '';
    var q3 = params.q3 || '';
    var q7 = params.q7 || '';
    var source = params.source || 'quiz';

    // Validate email
    if (!email || email.indexOf('@') === -1) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Email invalide'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Write to Sheet
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.getSheets()[0];
    }
    sheet.appendRow([
      new Date().toISOString(),
      prenom,
      email,
      profil,
      q1,
      q3,
      q7,
      source
    ]);

    // Send welcome email
    var profileData = PROFILES[profil] || PROFILES.debutant;
    sendWelcomeEmail(email, prenom, profil, profileData);

    // Redirect to merci page with profile info
    var merciUrl = MERCI_URL +
      '?profil=' + encodeURIComponent(profil) +
      '&prenom=' + encodeURIComponent(prenom) +
      '&emoji=' + encodeURIComponent(profileData.emoji) +
      '&name=' + encodeURIComponent(profileData.name) +
      '&tagline=' + encodeURIComponent(profileData.tagline) +
      '&color=' + encodeURIComponent(profileData.color);

    return HtmlService.createHtmlOutput(
      '<meta http-equiv="refresh" content="0;url=\'' + merciUrl + '\'">'
    );

  } catch (err) {
    // Fallback redirect on error
    var fallbackUrl = MERCI_URL + '?profil=debutant&prenom=&error=1';
    return HtmlService.createHtmlOutput(
      '<meta http-equiv="refresh" content="0;url=\'' + fallbackUrl + '\'">'
    );
  }
}

function sendWelcomeEmail(email, prenom, profil, profileData) {
  var strengthsHtml = profileData.strengths.map(function(s) {
    return '<li style="margin:8px 0;padding-left:8px;">✅ ' + s + '</li>';
  }).join('');

  var nextStepsHtml = profileData.nextSteps.map(function(s, i) {
    return '<li style="margin:10px 0;padding:12px 16px;background:#1e1e2e;border-radius:8px;border-left:3px solid ' + profileData.color + ';">' +
      '<strong>Étape ' + (i + 1) + '</strong><br>' + s + '</li>';
  }).join('');

  var htmlBody = '<!DOCTYPE html><html><head><meta charset="utf-8"></head>' +
    '<body style="margin:0;padding:0;background:#0f0f1a;font-family:Arial,sans-serif;color:#e0e0e0;">' +
    '<table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f1a;min-height:100vh;">' +
    '<tr><td align="center" style="padding:20px;">' +
    '<table width="600" cellpadding="0" cellspacing="0" style="background:#16162a;border-radius:16px;overflow:hidden;">' +

    // Header
    '<tr><td style="background:' + profileData.color + ';padding:30px 40px;text-align:center;">' +
    '<h1 style="margin:0;color:#0f0f1a;font-size:28px;">' + profileData.emoji + ' ' + profileData.name + '</h1>' +
    '<p style="margin:8px 0 0;color:#0f0f1a;font-size:16px;font-style:italic;">' + profileData.tagline + '</p>' +
    '</td></tr>' +

    // Greeting
    '<tr><td style="padding:30px 40px;">' +
    '<p style="font-size:18px;margin:0;">Salut' + (prenom ? ' <strong>' + prenom + '</strong>' : '') + ' 👋</p>' +
    '<p style="font-size:15px;margin:16px 0 0;color:#a0a0b0;">Merci d\'avoir complété le diagnostic Pokévendre Pro. Voici ton profil personnalisé :</p>' +
    '</td></tr>' +

    // Strengths
    '<tr><td style="padding:0 40px 20px;">' +
    '<h2 style="color:' + profileData.color + ';font-size:16px;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">💪 Tes forces</h2>' +
    '<ul style="list-style:none;padding:0;margin:0;">' + strengthsHtml + '</ul>' +
    '</td></tr>' +

    // Advice
    '<tr><td style="padding:0 40px 20px;">' +
    '<h2 style="color:' + profileData.color + ';font-size:16px;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">🎯 Ce qu\'il te faut</h2>' +
    '<p style="font-size:15px;line-height:1.6;color:#c0c0d0;background:#1a1a30;padding:16px;border-radius:8px;margin:0;">' + profileData.advice + '</p>' +
    '</td></tr>' +

    // Next steps
    '<tr><td style="padding:0 40px 30px;">' +
    '<h2 style="color:' + profileData.color + ';font-size:16px;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">🚀 Tes prochaines étapes</h2>' +
    '<ol style="list-style:none;padding:0;margin:0;">' + nextStepsHtml + '</ol>' +
    '</td></tr>' +

    // CTA
    '<tr><td style="padding:0 40px 30px;text-align:center;">' +
    '<a href="https://pokevendrepro.com" style="display:inline-block;background:' + profileData.color + ';color:#0f0f1a;padding:16px 40px;border-radius:8px;text-decoration:none;font-size:16px;font-weight:bold;">Découvrir Pokévendre Pro →</a>' +
    '</td></tr>' +

    // Footer
    '<tr><td style="padding:20px 40px;border-top:1px solid #2a2a40;text-align:center;">' +
    '<p style="margin:0;color:#606080;font-size:12px;">Pokévendre Pro — La méthode pour revendre des cartes Pokémon rentablement</p>' +
    '</td></tr>' +

    '</table></td></tr></table></body></html>';

  var textBody = profileData.emoji + ' ' + profileData.name + '\n\n' +
    'Salut' + (prenom ? ' ' + prenom : '') + ',\n\n' +
    'Merci pour ton diagnostic Pokévendre Pro !\n\n' +
    'Tes forces :\n' + profileData.strengths.map(function(s) { return '- ' + s; }).join('\n') + '\n\n' +
    profileData.advice + '\n\n' +
    'Prochaines étapes :\n' + profileData.nextSteps.map(function(s, i) { return (i + 1) + '. ' + s; }).join('\n') + '\n\n' +
    'Découvre Pokévendre Pro : https://pokevendrepro.com';

  MailApp.sendEmail({
    to: email,
    subject: profileData.subject,
    htmlBody: htmlBody,
    body: textBody,
    name: FROM_NAME
  });
}