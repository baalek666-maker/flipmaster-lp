// ============================================================
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
  return '<tr><td style="padding:3px 40px;"><p style="margin:0;color:#d1d5db;font-size:14px;line-height:1.6;">\u2705 ' + text + '</p></td></tr>';
}
function crossItem(text) {
  return '<tr><td style="padding:3px 40px;"><p style="margin:0;color:#6b7280;font-size:14px;line-height:1.6;">\u274c ' + text + '</p></td></tr>';
}


// ============================================================
// EMAIL 1 — Pre Pre-Launch (Curiosité)
// Accent: violet #8b5cf6
// ============================================================
function buildEmail1(prenom) {
  var a = ACCENT[1];
  var body = '';
  body += '<tr><td style="padding:32px 40px 8px;"><p style="margin:0;color:#ffffff;font-size:18px;">Salut ' + prenom + ',</p></td></tr>';
  body += paragraph('J\'ai une question.');
  body += highlightBox('Si tu pouvais recommencer la revente de cartes Pokémon à zéro aujourd\'hui, avec tout ce que tu sais maintenant… tu referais les mêmes erreurs ?', a);
  body += paragraph('Pas la théorie. Les vraies. Celles qui t\'ont coûté de l\'argent. Celles où tu as acheté au feeling et regrette encore.');
  body += paragraph('Moi, j\'en ai fait plein. Et la semaine prochaine, je vais te raconter lesquelles — et combien elles m\'ont coûté.');
  body += separator();
  body += boldParagraph('Mais aujourd\'hui, je veux juste savoir : toi, c\'est quoi l\'erreur que tu referais PAS ?');
  body += '<tr><td style="padding:8px 40px;"><div style="background:rgba(' + hexToRgb(a) + ',0.06);border:1px solid rgba(' + hexToRgb(a) + ',0.12);border-radius:10px;padding:16px 20px;text-align:center;"><p style="margin:0;color:' + a + ';font-size:14px;">\U0001f4ac R\u00e9ponds \u00e0 cet email. Une phrase suffit. Je lis chaque r\u00e9ponse.</p></div></td></tr>';
  body += spacer('12');
  body += signature();
  body += psBlock('P.S. La semaine prochaine, je t\'envoie un email qui va probablement te surprendre. Ne le supprime pas.');
  return {
    subject: 'j\'ai une question bizarre pour toi',
    html: emailShell(a, 'j\'ai une question bizarre pour toi', 'Une question importante pour toi, ' + prenom + '...', body),
    text: 'Salut ' + prenom + ',\n\nJ\'ai une question.\n\nSi tu pouvais recommencer la revente de cartes Pokémon à zéro aujourd\'hui, avec tout ce que tu sais maintenant… tu referais les mêmes erreurs ?\n\nPas la théorie. Les vraies. Celles qui t\'ont coûté de l\'argent.\n\nMoi, j\'en ai fait plein. Et la semaine prochaine, je vais te raconter lesquelles — et combien elles m\'ont coûté.\n\nMais aujourd\'hui, je veux juste savoir : toi, c\'est quoi l\'erreur que tu referais PAS ?\n\nRéponds à cet email. Une phrase suffit. Je lis chaque réponse.\n\n— {sender}\n\nP.S. La semaine prochaine, je t\'envoie un email qui va probablement te surprendr. Ne le supprime pas.'
  };
}


// ============================================================
// EMAIL 2 — Announcement + WHY
// Accent: orange #f97316
// ============================================================
function buildEmail2(prenom) {
  var a = ACCENT[2];
  var body = '';
  body += '<tr><td style="padding:32px 40px 8px;"><p style="margin:0;color:#ffffff;font-size:18px;">Salut ' + prenom + ',</p></td></tr>';
  body += paragraph('La semaine dernière, je t\'ai demandé quelle erreur tu referais pas.');
  body += paragraph('J\'ai reçu des dizaines de réponses. Et 90% disaient la même chose :');
  body += '<tr><td style="padding:12px 40px;"><div style="background:rgba(' + hexToRgb(a) + ',0.1);border-left:4px solid ' + a + ';border-radius:0 12px 12px 0;padding:20px 24px;text-align:center;"><p style="margin:0;color:#ffffff;font-size:20px;font-weight:800;font-style:italic;">\u00ab J\'ai achet\u00e9 au feeling. \u00bb</p></div></td></tr>';
  body += paragraph('Moi aussi. Trois fois. <span style="color:' + a + ';font-weight:700;">200\u20ac perdus \u00e0 chaque fois.</span>');
  body += paragraph('Et c\'est là que j\'ai compris un truc : le problème, c\'est pas les cartes. C\'est pas le marché. C\'est pas Vinted ou eBay.');
  body += boldParagraph('Le problème, c\'est qu\'il n\'y a pas de système.');
  body += '<tr><td style="padding:8px 40px;"><div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:16px 20px;"><p style="margin:0 0 8px;color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Le calcul que 90% des revendeurs ne font pas</p><p style="margin:0;color:#d1d5db;font-size:14px;line-height:1.7;">Tu ach\u00e8tes une carte <span style="color:#ffffff;font-weight:600;">30\u20ac</span>, tu la revends <span style="color:#ffffff;font-weight:600;">50\u20ac</span>. Profit = 20\u20ac ?<br><span style="color:' + a + ';font-weight:700;">Non.</span> Fees eBay 13% + shipping + emballage = <span style="color:#ef4444;font-weight:700;">8,50\u20ac</span> de profit r\u00e9el.</p></div></td></tr>';
  body += spacer('8');
  body += boldParagraph('C\'est pour ça que je lance Pokévendre Pro.');
  body += paragraph('C\'est pas un ebook. C\'est pas des \u00ab astuces \u00bb. C\'est un <span style="color:' + a + ';font-weight:700;">syst\u00e8me complet</span> qui \u00e9limine le guessing — tu sais exactement quoi acheter, \u00e0 quel prix, et quand revendre.');
  body += proofCard('Sarah, maman de 2 enfants', '+400\u20ac/mois en 45 min le soir', a);
  body += paragraph('<span style="color:#9ca3af;font-size:13px;">Elle croyait que le march\u00e9 \u00e9tait satur\u00e9. Premier mois : +87\u20ac. Deuxi\u00e8me mois : +210\u20ac.</span>');
  body += boldParagraph('Pas de la chance. Un syst\u00e8me.');
  body += paragraph('La semaine prochaine, je te montre exactement ce qu\'il y a dedans.');
  body += separator();
  body += '<tr><td style="padding:8px 40px;"><div style="background:rgba(' + hexToRgb(a) + ',0.06);border:1px solid rgba(' + hexToRgb(a) + ',0.12);border-radius:10px;padding:16px 20px;text-align:center;"><p style="margin:0;color:' + a + ';font-size:14px;">\U0001f4ac Qu\'est-ce qui te ferait confiance en un syst\u00e8me de revente ?<br>R\u00e9ponds-moi. \u00c7a m\'aide \u00e0 construire la bonne chose.</p></div></td></tr>';
  body += spacer('12');
  body += signature();
  body += psBlock('P.S. Dimanche prochain, je te montre les 4 piliers du syst\u00e8me. Celui que 90% des revendeurs ignorent va te surprendre.');
  return {
    subject: 'la raison pour laquelle j\'ai cr\u00e9\u00e9 \u00e7a',
    html: emailShell(a, 'la raison pour laquelle j\'ai cr\u00e9\u00e9 \u00e7a', '90% des revendeurs font la m\u00eame erreur...', body),
    text: 'Salut ' + prenom + ',\n\nLa semaine derni\u00e8re, je t\'ai demand\u00e9 quelle erreur tu referais pas.\n\nJ\'ai re\u00e7u des dizaines de r\u00e9ponses. Et 90% disaient la m\u00eame chose :\n\n\u00ab J\'ai achet\u00e9 au feeling. \u00bb\n\nMoi aussi. Trois fois. 200\u20ac perdus \u00e0 chaque fois.\n\nLe probl\u00e8me, c\'est qu\'il n\'y a pas de syst\u00e8me.\n\nC\'est pour \u00e7a que je lance Pok\u00e9vendre Pro.\n\nSarah : +400\u20ac/mois en 45 min le soir. Pas de la chance. Un syst\u00e8me.\n\n\u0001f4ac Qu\'est-ce qui te ferait confiance ?\n\n\u2014 {sender}\n\nP.S. Dimanche prochain, les 4 piliers.'
  };
}


// ============================================================
// EMAIL 3 — WHAT + HOW
// Accent: bleu #3b82f6
// ============================================================
function buildEmail3(prenom) {
  var a = ACCENT[3];
  var body = '';
  body += '<tr><td style="padding:32px 40px 8px;"><p style="margin:0;color:#ffffff;font-size:18px;">Salut ' + prenom + ',</p></td></tr>';
  body += paragraph('Tu sais POURQUOI Pok\u00e9vendre Pro existe. Maintenant, voici CE QUE c\'est et COMMENT \u00e7a marche.');
  body += '<tr><td style="padding:12px 40px;"><div style="background:rgba(' + hexToRgb(a) + ',0.1);border-radius:12px;padding:20px;text-align:center;"><p style="margin:0;color:#ffffff;font-size:18px;font-weight:800;letter-spacing:0.5px;">4 piliers. Rien de sexy. Mais \u00e7a marche.</p></div></td></tr>';
  body += spacer('8');
  // Pillar 1
  body += '<tr><td style="padding:8px 40px;"><div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:16px 20px;"><p style="margin:0 0 4px;"><span style="display:inline-block;width:28px;height:28px;line-height:28px;text-align:center;background:rgba(' + hexToRgb(a) + ',0.15);border-radius:8px;color:' + a + ';font-weight:700;font-size:13px;">1</span></p><p style="margin:0 0 6px;color:#ffffff;font-size:15px;font-weight:700;">Trouver les bonnes cartes</p><p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.5;">Des keywords pr\u00e9cis, des filtres par set, raret\u00e9, prix. Tu sais exactement quoi chercher avant d\'ouvrir une seule page.</p></div></td></tr>';
  // Pillar 2 (highlighted)
  body += '<tr><td style="padding:8px 40px;"><div style="background:rgba(' + hexToRgb(a) + ',0.06);border:1px solid rgba(' + hexToRgb(a) + ',0.2);border-radius:10px;padding:16px 20px;"><p style="margin:0 0 4px;"><span style="display:inline-block;width:28px;height:28px;line-height:28px;text-align:center;background:rgba(' + hexToRgb(a) + ',0.15);border-radius:8px;color:' + a + ';font-weight:700;font-size:13px;">2</span> <span style="color:' + a + ';font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Le plus important</span></p><p style="margin:0 0 6px;color:#ffffff;font-size:15px;font-weight:700;">Calculer le spread r\u00e9el</p><p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.5;">Prix de vente \u2014 frais \u2014 shipping \u2014 taxe = profit r\u00e9el. Si c\'est positif, tu ach\u00e8tes. Si c\'est n\u00e9gatif, tu passes. Plus de devinettes.</p></div></td></tr>';
  // Pillar 3
  body += '<tr><td style="padding:8px 40px;"><div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:16px 20px;"><p style="margin:0 0 4px;"><span style="display:inline-block;width:28px;height:28px;line-height:28px;text-align:center;background:rgba(' + hexToRgb(a) + ',0.15);border-radius:8px;color:' + a + ';font-weight:700;font-size:13px;">3</span></p><p style="margin:0 0 6px;color:#ffffff;font-size:15px;font-weight:700;">Acheter au bon prix</p><p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.5;">Des seuils clairs. En dessous de X\u20ac, tu ach\u00e8tes. Au-dessus, tu attends. C\'est math\u00e9matique, pas \u00e9motionnel.</p></div></td></tr>';
  // Pillar 4
  body += '<tr><td style="padding:8px 40px;"><div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:16px 20px;"><p style="margin:0 0 4px;"><span style="display:inline-block;width:28px;height:28px;line-height:28px;text-align:center;background:rgba(' + hexToRgb(a) + ',0.15);border-radius:8px;color:' + a + ';font-weight:700;font-size:13px;">4</span></p><p style="margin:0 0 6px;color:#ffffff;font-size:15px;font-weight:700;">Revendre au bon moment</p><p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.5;">Le timing compte. Il y a des moments pour vendre et des moments pour garder. Le syst\u00e8me te dit quand.</p></div></td></tr>';
  body += spacer('8');
  body += proofCard('Mehdi, \u00e9tudiant', '+250\u20ac/mois avec le calculateur de spread', a);
  body += proofCard('Thomas, z\u00e9ro exp\u00e9rience Pok\u00e9mon', '+1 200\u20ac/mois, 30 min/jour', a);
  body += separator();
  body += sectionHeading('\u2705', 'Ce que tu obtiens', a);
  body += checkItem('Le syst\u00e8me complet — 4 piliers d\u00e9taill\u00e9s, \u00e9tape par \u00e9tape');
  body += checkItem('La checklist anti-arnaques — plus jamais le pigeon');
  body += checkItem('Le calculateur de spread — le vrai profit avant d\'acheter');
  body += checkItem('Les keywords et seuils d\'achat \u00e0 jour — mis \u00e0 jour chaque mois');
  body += checkItem('L\'acc\u00e8s \u00e0 la communaut\u00e9 — des gens comme toi qui appliquent le syst\u00e8me');
  body += checkItem('Les mises \u00e0 jour \u00e0 vie — le march\u00e9 change, le syst\u00e8me \u00e9volue avec');
  body += spacer('8');
  body += sectionHeading('\u274c', 'Ce que tu n\'as PAS', '#6b7280');
  body += crossItem('Des promesses de richesse rapide');
  body += crossItem('Des \u00ab hacks \u00bb qui marchent plus dans 2 semaines');
  body += crossItem('Du contenu g\u00e9n\u00e9rique trouv\u00e9 sur YouTube');
  body += separator();
  body += boldParagraph('Dimanche prochain, la formation ouvre. Tu auras le lien d\'achat directement dans ta bo\u00eete.');
  body += '<tr><td style="padding:8px 40px;"><div style="background:rgba(' + hexToRgb(a) + ',0.08);border:1px solid rgba(' + hexToRgb(a) + ',0.15);border-radius:10px;padding:16px 20px;text-align:center;"><p style="margin:0;color:' + a + ';font-size:18px;font-weight:800;">50 places</p><p style="margin:4px 0 0;color:#9ca3af;font-size:12px;">Pas 50 par jour. 50, total. Je r\u00e9ponds personnellement aux questions.</p></div></td></tr>';
  body += spacer('8');
  body += '<tr><td style="padding:8px 40px;"><div style="background:rgba(' + hexToRgb(a) + ',0.06);border:1px solid rgba(' + hexToRgb(a) + ',0.12);border-radius:10px;padding:16px 20px;text-align:center;"><p style="margin:0;color:' + a + ';font-size:14px;">\U0001f4ac Parmi les 4 piliers, lequel te semble le plus flou ?<br>R\u00e9ponds avec juste un num\u00e9ro (1, 2, 3 ou 4).</p></div></td></tr>';
  body += spacer('12');
  body += signature();
  body += psBlock('P.S. Ce dimanche, tu recevras l\'email que tu attends. Pr\u00e9pare-toi.');
  return {
    subject: 'les 4 piliers (et ce que tu vas obtenir)',
    html: emailShell(a, 'les 4 piliers (et ce que tu vas obtenir)', '4 piliers. Rien de sexy. Mais \u00e7a marche.', body),
    text: 'Salut ' + prenom + ',\n\n4 piliers. Rien de sexy. Mais \u00e7a marche.\n\n1. Trouver les bonnes cartes\n2. Calculer le spread r\u00e9el (le plus important)\n3. Acheter au bon prix\n4. Revendre au bon moment\n\n50 places. Dimanche prochain, \u00e7a ouvre.\n\n\u2014 {sender}\n\nP.S. Ce dimanche, l\'email que tu attends.'
  };
}


// ============================================================
// EMAIL 4 — LAUNCH
// Accent: vert #4ade80
// ============================================================
function buildEmail4(prenom) {
  var a = ACCENT[4];
  var body = '';
  body += '<tr><td style="padding:32px 40px 8px;"><p style="margin:0;color:#ffffff;font-size:18px;">Salut ' + prenom + ',</p></td></tr>';
  body += paragraph('C\'est aujourd\'hui.');
  body += '<tr><td style="padding:12px 40px;"><div style="background:rgba(' + hexToRgb(a) + ',0.12);border:2px solid ' + a + ';border-radius:12px;padding:24px;text-align:center;"><p style="margin:0;color:' + a + ';font-size:24px;font-weight:800;letter-spacing:0.5px;">\U0001f680 POK\u00c9VENDRE PRO EST OUVERT</p></div></td></tr>';
  body += paragraph('Pendant 3 semaines, je t\'ai racont\u00e9 mes erreurs. Celles de Sarah, Mehdi, Thomas. Je t\'ai montr\u00e9 le syst\u00e8me. Tu sais comment \u00e7a marche. Tu sais que \u00e7a marche.');
  body += boldParagraph('Tu n\'as plus besoin de deviner.');
  body += ctaButton('Rejoindre Pok\u00e9vendre Pro \u2014 50 places \u2192', '{lien_achat}', a);
  body += separator();
  body += '<tr><td style="padding:12px 40px;"><div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:20px;text-align:center;"><p style="margin:0 0 8px;color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Le prix</p><p style="margin:0 0 8px;color:#ffffff;font-size:32px;font-weight:800;">{prix}\u20ac</p><p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.5;">Pourquoi ce prix ? Parce que je veux des gens qui sont pr\u00eats \u00e0 s\'investir. Si ce prix t\'effraie, c\'est que t\'es pas encore pr\u00eat \u00e0 prendre \u00e7a au s\u00e9rieux. Et c\'est OK.</p><p style="margin:12px 0 0;color:#9ca3af;font-size:13px;line-height:1.5;">Pourquoi pas plus ? Parce que j\'ai commenc\u00e9 avec 200\u20ac en poche. Je sais ce que c\'est de compter chaque euro.</p></div></td></tr>';
  body += '<tr><td style="padding:16px 40px;text-align:center;"><p style="margin:0;color:' + a + ';font-size:20px;font-weight:800;">50 places. Quand elles sont parties, c\'est ferm\u00e9.</p></td></tr>';
  body += proofCard('Julie', 'A commenc\u00e9 par curiosit\u00e9 \u2192 +800\u20ac/mois \u2192 a arr\u00eat\u00e9 son job de caissi\u00e8re', a);
  body += paragraph('<span style="color:#9ca3af;font-size:13px;">Pas de la chance. Des donn\u00e9es.</span>');
  body += ctaButton('Rejoindre Pok\u00e9vendre Pro maintenant \u2192', '{lien_achat}', a);
  body += paragraph('Si t\'es pas s\u00fbr, c\'est OK. Je t\'enverrai un email mercredi pour te donner un \u00e9l\u00e9ment de plus.');
  body += boldParagraph('Mais les places partent.');
  body += spacer('8');
  body += signature();
  body += psBlock('P.S. Tu as une question qui te bloque ? R\u00e9ponds \u00e0 cet email. Je lis tout.');
  return {
    subject: 'c\'est aujourd\'hui (' + prenom + ')',
    html: emailShell(a, 'c\'est aujourd\'hui', 'Pok\u00e9vendre Pro est ouvert. 50 places.', body),
    text: 'Salut ' + prenom + ',\n\nC\'est aujourd\'hui.\n\n\U0001f680 POK\u00c9VENDRE PRO EST OUVERT\n\nTu n\'as plus besoin de deviner.\n\n\U0001f449 Rejoindre Pok\u00e9vendre Pro : {lien_achat}\n\nLe prix : {prix}\u20ac\n\n50 places. Quand elles sont parties, c\'est ferm\u00e9.\n\n\u2014 {sender}\n\nP.S. Tu as une question ? R\u00e9ponds \u00e0 cet email.'
  };
}


// ============================================================
// EMAIL 5 — Mid Campaign (Vulnérabilité + Preuve)
// Accent: ambre #facc15
// ============================================================
function buildEmail5(prenom) {
  var a = ACCENT[5];
  var body = '';
  body += '<tr><td style="padding:32px 40px 8px;"><p style="margin:0;color:#ffffff;font-size:18px;">Salut ' + prenom + ',</p></td></tr>';
  body += paragraph('Je dois te dire un truc.');
  body += quoteBox('Pendant 6 mois, j\'ai perdu de l\'argent sur la revente Pok\u00e9mon. Pas un peu. <span style="color:#ffffff;font-weight:700;">1 200\u20ac</span>. En achetant au feeling, en n\u00e9gligeant les frais, en \u00e9coutant les \u00ab bons plans \u00bb de Twitter.', a);
  body += paragraph('1 200\u20ac, c\'est le prix d\'un EF metavault complet. Ou 3 semaines de courses. Ou un weekend \u00e0 Disneyland pour ma famille.');
  body += boldParagraph('J\'aurais pu \u00e9viter \u00e7a.');
  body += paragraph('Parce qu\'en fait, les erreurs \u00e9taient \u00e9videntes. Mais je les voyais pas, parce que j\'avais pas de cadre. Pas de syst\u00e8me. Juste des intuitions et de l\'espoir.');
  body += separator();
  body += sectionHeading('\U0001f50d', 'Pourquoi je te raconte \u00e7a', a);
  body += paragraph('Pas pour la sympathie. Pour que tu comprennes un truc :');
  body += highlightBox('Si t\'es en train de perdre de l\'argent sur la revente Pok\u00e9mon en 2025, c\'est pas ta faute. C\'est ton syst\u00e8me qui est cass\u00e9.', a);
  body += paragraph('Et un syst\u00e8me cass\u00e9, \u00e7a se r\u00e9pare. Mais \u00e7a se r\u00e9pare pas tout seul.');
  body += proofCard('Sarah', '\u00ab J\'ai perdu 300\u20ac en 2 mois avant le syst\u00e8me. Premier mois avec : +87\u20ac. Deuxi\u00e8me : +210\u20ac. \u00bb', a);
  body += proofCard('Mehdi', '\u00ab Le calculateur de spread m\'a \u00e9vit\u00e9 3 mauvaises achats cette semaine. \u00c7a paye d\u00e9j\u00e0 la formation. \u00bb', a);
  body += separator();
  body += boldParagraph('Il reste des places. Mais elles partent.');
  body += ctaButton('Rejoindre Pok\u00e9vendre Pro \u2192', '{lien_achat}', a);
  body += paragraph('Si t\'es pas encore pr\u00eat, je comprends. Mais demande-toi : <span style="color:' + a + ';font-weight:700;">combien tu vas encore perdre avant de changer de m\u00e9thode ?</span>');
  body += spacer('8');
  body += signature();
  body += psBlock('P.S. Ce week-end, je t\'enverrai un dernier \u00e9l\u00e9ment de r\u00e9flexion. Pas de la pression. De la clart\u00e9.');
  return {
    subject: 'j\'ai perdu 1 200\u20ac (' + prenom + ')',
    html: emailShell(a, 'j\'ai perdu 1 200\u20ac', 'Pourquoi je te raconte \u00e7a aujourd\'hui...', body),
    text: 'Salut ' + prenom + ',\n\nPendant 6 mois, j\'ai perdu 1 200\u20ac sur la revente Pok\u00e9mon.\n\nEn achetant au feeling. En n\u00e9gligeant les frais. En \u00e9coutant les \u00ab bons plans \u00bb.\n\nSi t\'es en train de perdre de l\'argent, c\'est pas ta faute. C\'est ton syst\u00e8me qui est cass\u00e9.\n\nSarah : +210\u20ac/mois avec le syst\u00e8me. Mehdi : le calculateur lui a \u00e9vit\u00e9 3 mauvais achats cette semaine.\n\nIl reste des places.\n\n\u2014 {sender}\n\nP.S. Ce week-end, un dernier \u00e9l\u00e9ment de r\u00e9flexion.'
  };
}


// ============================================================
// EMAIL 6 — Last Weekend (Coût de l'inaction)
// Accent: rouge #ef4444
// ============================================================
function buildEmail6(prenom) {
  var a = ACCENT[6];
  var body = '';
  body += '<tr><td style="padding:32px 40px 8px;"><p style="margin:0;color:#ffffff;font-size:18px;">Salut ' + prenom + ',</p></td></tr>';
  body += paragraph('On va \u00eatre direct.');
  body += '<tr><td style="padding:12px 40px;"><div style="background:rgba(' + hexToRgb(a) + ',0.1);border-left:4px solid ' + a + ';border-radius:0 12px 12px 0;padding:20px 24px;text-align:center;"><p style="margin:0;color:#ffffff;font-size:18px;font-weight:800;">Combien co\u00fbte le fait de ne rien faire ?</p></div></td></tr>';
  body += spacer('8');
  body += '<tr><td style="padding:8px 40px;"><div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:20px;"><p style="margin:0 0 8px;color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Le calcul que personne ne fait</p><p style="margin:0 0 12px;color:#d1d5db;font-size:15px;line-height:1.7;">Tu ach\u00e8tes 3 cartes/mois au feeling.<br>Tu perds en moyenne <span style="color:' + a + ';font-weight:700;">15\u20ac</span> par carte (mauvais prix, frais cach\u00e9s).<br>6 mois \u00e7a fait : <span style="color:' + a + ';font-weight:700;">270\u20ac</span> perdus.</p><p style="margin:0;color:#d1d5db;font-size:15px;line-height:1.7;">En parall\u00e8le, Sarah, qui a commenc\u00e9 en m\u00eame temps que toi avec le syst\u00e8me :<br>Elle a gagn\u00e9 <span style="color:#4ade80;font-weight:700;">+1 200\u20ac</span> sur la m\u00eame p\u00e9riode.</p><p style="margin:12px 0 0;color:#ffffff;font-size:17px;font-weight:700;">L\'\u00e9cart ? <span style="color:' + a + ';">1 470\u20ac.</span></p></div><p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.5;text-align:center;">Pas de la chance. Un syst\u00e8me vs pas de syst\u00e8me.</p></td></tr>';
  body += spacer('8');
  body += paragraph('Ce n\'est pas une question de talent. C\'est une question de m\u00e9thode.');
  body += paragraph('Tu as d\u00e9j\u00e0 les donn\u00e9es. Sarah, Mehdi, Thomas — ils \u00e9taient o\u00f9 tu es. Ils ont pris une d\u00e9cision.');
  body += separator();
  body += sectionHeading('\u23f0', 'Il reste moins de 48h', a);
  body += boldParagraph('Dimanche soir, c\'est ferm\u00e9.');
  body += ctaButton('Rejoindre Pok\u00e9vendre Pro \u2192', '{lien_achat}', a);
  body += spacer('8');
  body += '<tr><td style="padding:8px 40px;"><div style="background:rgba(' + hexToRgb(a) + ',0.06);border:1px solid rgba(' + hexToRgb(a) + ',0.12);border-radius:10px;padding:16px 20px;text-align:center;"><p style="margin:0;color:' + a + ';font-size:14px;">\U0001f4ac Tu h\u00e9sites encore ? Dis-moi ce qui te bloque. Je r\u00e9ponds personnellement.</p></div></td></tr>';
  body += spacer('12');
  body += signature();
  return {
    subject: 'le co\u00fbt de ne rien faire',
    html: emailShell(a, 'le co\u00fbt de ne rien faire', 'Combien co\u00fbte le fait de ne rien faire ?', body),
    text: 'Salut ' + prenom + ',\n\nCombien co\u00fbte le fait de ne rien faire ?\n\nTu ach\u00e8tes 3 cartes/mois au feeling.\nTu perds 15\u20ac par carte en moyenne.\n6 mois = 270\u20ac perdus.\n\nSarah, m\u00eame p\u00e9riode, avec le syst\u00e8me : +1 200\u20ac.\n\nL\'\u00e9cart ? 1 470\u20ac.\n\nDimanche soir, c\'est ferm\u00e9.\n\n\u2014 {sender}'
  };
}


// ============================================================
// EMAIL 7 — End Reminder Morning (Countdown)
// Accent: rouge #ef4444
// ============================================================
function buildEmail7(prenom) {
  var a = ACCENT[7];
  var body = '';
  body += '<tr><td style="padding:32px 40px 8px;"><p style="margin:0;color:#ffffff;font-size:18px;">Salut ' + prenom + ',</p></td></tr>';
  body += paragraph('C\'est le dernier jour.');
  body += '<tr><td style="padding:16px 40px;text-align:center;"><p style="margin:0;color:' + a + ';font-size:36px;font-weight:800;letter-spacing:1px;">12H</p><p style="margin:4px 0 0;color:#9ca3af;font-size:13px;text-transform:uppercase;letter-spacing:1px;">avant la fermeture</p></td></tr>';
  body += separator();
  body += sectionHeading('\U0001f4cb', 'R\u00e9cap rapide', a);
  body += checkItem('Trouver les bonnes cartes — keywords, filtres, seuils');
  body += checkItem('Calculer le spread r\u00e9el — fin du guessing');
  body += checkItem('Acheter au bon prix — seuils math\u00e9matiques');
  body += checkItem('Revendre au bon moment — timing optimis\u00e9');
  body += checkItem('Checklist anti-arnaques');
  body += checkItem('Calculateur de spread');
  body += checkItem('Communaut\u00e9 + mises \u00e0 jour \u00e0 vie');
  body += spacer('8');
  body += proofCard('R\u00e9sultats', 'Sarah +400\u20ac/mois \u2022 Mehdi +250\u20ac/mois \u2022 Thomas +1 200\u20ac/mois', a);
  body += separator();
  body += paragraph('Ce n\'est pas une question de si \u00e7a marche. La question, c\'est : est-ce que tu veux que \u00e7a marche pour toi ?');
  body += ctaButton('Derni\u00e8re chance \u2192 Rejoindre', '{lien_achat}', a);
  body += spacer('8');
  body += '<tr><td style="padding:8px 40px;"><div style="background:rgba(' + hexToRgb(a) + ',0.06);border:1px solid rgba(' + hexToRgb(a) + ',0.12);border-radius:10px;padding:16px 20px;text-align:center;"><p style="margin:0;color:#9ca3af;font-size:13px;">Ce soir, tu recevras un dernier email. Pas pour te convaincre. Juste pour te rappeler que la porte se ferme.</p></div></td></tr>';
  body += spacer('12');
  body += signature();
  return {
    subject: 'dernier jour (' + prenom + ')',
    html: emailShell(a, 'dernier jour', '12h avant la fermeture', body),
    text: 'Salut ' + prenom + ',\n\nC\'est le dernier jour.\n\n12H avant la fermeture.\n\nR\u00e9cap : 4 piliers + checklist + calculateur + communaut\u00e9 + mises \u00e0 jour \u00e0 vie.\n\nSarah +400\u20ac/mois \u2022 Mehdi +250\u20ac/mois \u2022 Thomas +1 200\u20ac/mois\n\n\u2014 {sender}'
  };
}


// ============================================================
// EMAIL 8 — End Reminder Evening (Dernier CTA)
// Accent: rouge foncé #dc2626
// ============================================================
function buildEmail8(prenom) {
  var a = ACCENT[8];
  var body = '';
  body += '<tr><td style="padding:32px 40px 8px;"><p style="margin:0;color:#ffffff;font-size:18px;">Salut ' + prenom + ',</p></td></tr>';
  body += paragraph('Ce soir, \u00e7a ferme.');
  body += '<tr><td style="padding:16px 40px;text-align:center;"><p style="margin:0;color:' + a + ';font-size:28px;font-weight:800;letter-spacing:1px;">MINUIT.</p><p style="margin:4px 0 0;color:#9ca3af;font-size:13px;text-transform:uppercase;letter-spacing:1px;">dernier d\u00e9lai</p></td></tr>';
  body += separator();
  body += paragraph('Pas de FOMO. Pas de fake urgence. Juste un fait :');
  body += highlightBox('Je ne peux pas accompagner plus de 50 personnes et garantir la qualit\u00e9. Donc \u00e7a ferme.', a);
  body += spacer('8');
  body += '<tr><td style="padding:8px 40px;"><div style="background:rgba(' + hexToRgb(a) + ',0.06);border:1px solid rgba(' + hexToRgb(a) + ',0.12);border-radius:10px;padding:20px;"><p style="margin:0 0 12px;color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Ce que tu d\u00e9cides ce soir</p><p style="margin:0 0 8px;color:#d1d5db;font-size:15px;line-height:1.7;">\u2705 Tu rejoins = tu as un syst\u00e8me, une communaut\u00e9, des mises \u00e0 jour \u00e0 vie.</p><p style="margin:0;color:#d1d5db;font-size:15px;line-height:1.7;">\u274c Tu passes = tu continues au feeling. Et dans 6 mois, tu seras au m\u00eame point qu\'aujourd\'hui.</p></div></td></tr>';
  body += spacer('8');
  body += ctaButton('Rejoindre avant minuit \u2192', '{lien_achat}', a);
  body += spacer('8');
  body += paragraph('Pas de jugement si tu passes. C\'est ta d\u00e9cision. Mais fais-la en toute connaissance de cause.');
  body += spacer('8');
  body += signature();
  body += psBlock('P.S. Apr\u00e8s minuit, le lien ne marchera plus. Pas de relance. Pas de deuxi\u00e8me chance. C\'est maintenant ou c\'est fini.');
  return {
    subject: 'c\'est maintenant ou c\'est fini',
    html: emailShell(a, 'c\'est maintenant ou c\'est fini', 'Minuit. Dernier d\u00e9lai.', body),
    text: 'Salut ' + prenom + ',\n\nCe soir, \u00e7a ferme. Minuit.\n\nPas de FOMO. Juste un fait : je ne peux pas accompagner plus de 50 personnes.\n\n\u2705 Tu rejoins = syst\u00e8me + communaut\u00e9 + mises \u00e0 jour \u00e0 vie.\n\u274c Tu passes = tu continues au feeling.\n\nApr\u00e8s minuit, le lien ne marchera plus.\n\n\u2014 {sender}\n\nP.S. Pas de relance. Pas de deuxi\u00e8me chance.'
  };
}


// ============================================================
// EMAIL 9 — Post-achat (Merci + Rassurance)
// Accent: vert #4ade80
// ============================================================
function buildEmail9(prenom) {
  var a = ACCENT[9];
  var body = '';
  body += '<tr><td style="padding:32px 40px 8px;"><p style="margin:0;color:#ffffff;font-size:18px;">Salut ' + prenom + ',</p></td></tr>';
  body += paragraph('Bienvenue dans Pok\u00e9vendre Pro.');
  body += '<tr><td style="padding:12px 40px;"><div style="background:rgba(' + hexToRgb(a) + ',0.12);border:2px solid ' + a + ';border-radius:12px;padding:24px;text-align:center;"><p style="margin:0;color:' + a + ';font-size:22px;font-weight:800;">\u2705 Tu as fait le bon choix.</p></div></td></tr>';
  body += spacer('8');
  body += paragraph('Pas le choix facile. Le bon choix. Celui qui change la donne.');
  body += sectionHeading('\U0001f4e5', 'Tes prochains pas', a);
  body += listItem('1', 'Check tes emails — tu vas recevoir ton acc\u00e8s dans les prochaines minutes', a);
  body += listItem('2', 'Commence par le Module 1 — les fondamentaux', a);
  body += listItem('3', 'Utilise le calculateur de spread sur ta prochaine carte', a);
  body += listItem('4', 'Rejoins la communaut\u00e9 — pr\u00e9sente-toi et dis-nous ton objectif', a);
  body += spacer('8');
  body += highlightBox('Conseil : ne saute pas d\'\u00e9tape. Le Module 1 prend 30 minutes. Apr\u00e8s \u00e7a, tu sauras exactement quoi chercher sur Vinted ou eBay.', a);
  body += separator();
  body += sectionHeading('\U0001f64c', 'Ce que les autres en disent', a);
  body += proofCard('Sarah', '\u00ab J\'ai commenc\u00e9 le soir m\u00eame. 3 jours apr\u00e8s, premier achat rentable. \u00bb', a);
  body += proofCard('Mehdi', '\u00ab Le calculateur m\'a sauv\u00e9 d\'un mauvais achat d\u00e8s le premier jour. D\u00e9j\u00e0 rentable. \u00bb', a);
  body += spacer('8');
  body += paragraph('Tu n\'es pas seul l\u00e0-dedans. La communaut\u00e9 est active, et je r\u00e9ponds personnellement aux questions.');
  body += separator();
  body += '<tr><td style="padding:8px 40px;"><div style="background:rgba(' + hexToRgb(a) + ',0.06);border:1px solid rgba(' + hexToRgb(a) + ',0.12);border-radius:10px;padding:16px 20px;text-align:center;"><p style="margin:0;color:' + a + ';font-size:14px;">\U0001f4ac Une question ? R\u00e9ponds \u00e0 cet email. Je suis l\u00e0.</p></div></td></tr>';
  body += spacer('12');
  body += boldParagraph('Bienvenue dans le syst\u00e8me.');
  body += signature();
  return {
    subject: 'bienvenue dans le syst\u00e8me (' + prenom + ')',
    html: emailShell(a, 'bienvenue dans le syst\u00e8me', 'Tes 4 prochains pas...', body),
    text: 'Salut ' + prenom + ',\n\nBienvenue dans Pok\u00e9vendre Pro.\n\n\u2705 Tu as fait le bon choix.\n\nTes prochains pas :\n1. Check tes emails — ton acc\u00e8s arrive\n2. Commence par le Module 1\n3. Utilise le calculateur de spread\n4. Rejoins la communaut\u00e9\n\nTu n\'es pas seul. Je r\u00e9ponds personnellement aux questions.\n\nBienvenue dans le syst\u00e8me.\n\n\u2014 {sender}'
  };
}


// ============================================================
// DISPATCHER — Retourne le bon email par numéro
// ============================================================
function getEmailHtml(emailNumber, prenom, profilName, profilColor) {
  var result;
  switch (emailNumber) {
    case 1: result = buildEmail1(prenom); break;
    case 2: result = buildEmail2(prenom); break;
    case 3: result = buildEmail3(prenom); break;
    case 4: result = buildEmail4(prenom); break;
    case 5: result = buildEmail5(prenom); break;
    case 6: result = buildEmail6(prenom); break;
    case 7: result = buildEmail7(prenom); break;
    case 8: result = buildEmail8(prenom); break;
    case 9: result = buildEmail9(prenom); break;
    default: throw new Error('Email ' + emailNumber + ' n\'existe pas. Num\u00e9ros valides : 1-9');
  }
  return result;
}

// ============================================================
// CALENDRIER D'ENVOI — Basé sur le Blueprint (doc60)
// ============================================================
// Email 1 : Dimanche S-4 (Pre Pre-Launch — curiosité)
// Email 2 : Dimanche S-3 (Annonce + POURQUOI)
// Email 3 : Dimanche S-2 (QUOI + COMMENT, 50 places)
// Email 4 : Dimanche S-1 (LAUNCH — lien d'achat)
// Email 5 : Mercredi S  (Mid Campaign — vulnérabilité + preuve)
// Email 6 : Vendredi S  (Last Weekend — coût inaction)
// Email 7 : Dimanche S matin (Countdown)
// Email 8 : Dimanche S soir  (Dernier CTA)
// Email 9 : Post-achat (Merci + rassurance, auto après achat)
//
// Deux pics de vente : Email 4 (launch) et Email 8 (clôture)
// S = semaine de lancement

var EMAIL_SCHEDULE = {
  1: { day: 'Dimanche S-4', timing: 'matin',   label: 'Pre Pre-Launch' },
  2: { day: 'Dimanche S-3', timing: 'matin',   label: 'Annonce + POURQUOI' },
  3: { day: 'Dimanche S-2', timing: 'matin',   label: 'QUOI + COMMENT' },
  4: { day: 'Dimanche S-1', timing: 'matin',   label: 'LAUNCH' },
  5: { day: 'Mercredi S',  timing: 'matin',   label: 'Mid Campaign' },
  6: { day: 'Vendredi S',  timing: 'matin',   label: 'Last Weekend' },
  7: { day: 'Dimanche S',  timing: 'matin',   label: 'Countdown' },
  8: { day: 'Dimanche S',  timing: 'soir',    label: 'Dernier CTA' },
  9: { day: 'Post-achat',  timing: 'immédiat', label: 'Bienvenue' }
};

// Helper pour calculer la date d'envoi à partir de la date de lancement
function getSendDate(emailNumber, launchDate) {
  var schedule = EMAIL_SCHEDULE[emailNumber];
  if (!schedule) return null;
  var d = new Date(launchDate);
  switch (emailNumber) {
    case 1: d.setDate(d.getDate() - 28); break; // S-4
    case 2: d.setDate(d.getDate() - 21); break; // S-3
    case 3: d.setDate(d.getDate() - 14); break; // S-2
    case 4: d.setDate(d.getDate() - 7);  break; // S-1
    case 5: d.setDate(d.getDate() - 4);  break; // MeS (-4 jours)
    case 6: d.setDate(d.getDate() - 2);  break; // VS (-2 jours)
    case 7: d.setHours(9, 0, 0, 0);      break; // DiS matin 9h
    case 8: d.setHours(20, 0, 0, 0);     break; // DiS soir 20h
    case 9: return new Date();            // immédiat
  }
  return d;
}
