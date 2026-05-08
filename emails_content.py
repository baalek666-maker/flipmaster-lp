#!/usr/bin/env python3
"""POKEVENDRE PRO - Email content for the 9-email evergreen sequence.
Design system: card #16162a, purple accent bar, logo, highlight boxes, proof cards, etc.
Matches the Apps Script emails-sequence-v4.gs design exactly.
"""

BASE_URL = 'https://pokevendrepro.com'
STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/4gM9AScw480n3778sP4gg01'

# ---- COULEURS D'ACCENT PAR EMAIL ----
ACCENT = {
    1: '#8b5cf6',  # violet — curiosite, mystere
    2: '#f97316',  # orange — annonce, passion
    3: '#3b82f6',  # bleu — structure, methode
    4: '#4ade80',  # vert — lancement, go
    5: '#facc15',  # ambre — vulnerabilite
    6: '#ef4444',  # rouge — inaction
    7: '#ef4444',  # rouge — countdown
    8: '#dc2626',  # rouge fonce — derniere chance
    9: '#4ade80',  # vert — bienvenue
}

def hex_to_rgb(hex_color):
    r = int(hex_color[1:3], 16)
    g = int(hex_color[3:5], 16)
    b = int(hex_color[5:7], 16)
    return f'{r},{g},{b}'

# ---- DESIGN SYSTEM HELPERS ----

def email_shell(accent, preview_text, body_content):
    """Wrapper HTML commun a tous les emails."""
    return (
        '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>'
        '<body style="margin:0;padding:0;background:#0f0f1a;font-family:Arial,Helvetica,sans-serif;color:#d1d5db;">'
        '<div style="display:none;font-size:1px;color:#0f0f1a;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">' + preview_text + '</div>'
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f1a;min-height:100vh;"><tr><td align="center" style="padding:20px 10px;">'
        '<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#16162a;border:1px solid rgba(255,255,255,0.06);border-radius:16px;overflow:hidden;">'
        '<tr><td style="background:' + accent + ';height:6px;font-size:0;line-height:0;">&nbsp;</td></tr>'
        '<tr><td style="padding:24px 40px 8px;text-align:center;"><span style="font-size:20px;font-weight:800;color:#ffffff;letter-spacing:0.5px;">POK\u00c9VENDRE PRO</span></td></tr>'
        + body_content +
        '<tr><td style="padding:0 40px;"><div style="border-top:1px solid rgba(255,255,255,0.06);"></div></td></tr>'
        '<tr><td style="padding:20px 40px 28px;text-align:center;">'
        '<p style="margin:0;color:#6b7280;font-size:11px;">Pok\u00e9vendre Pro \u2014 Le syst\u00e8me de d\u00e9cision pour revendeurs Pok\u00e9mon</p>'
        '<p style="margin:4px 0 0;color:#6b7280;font-size:11px;">Tu re\u00e7ois cet email car tu as compl\u00e9t\u00e9 le quiz sur pokevendrepro.com</p>'
        '<p style="margin:8px 0 0;color:#6b7280;font-size:11px;"><a href="{{unsubscribe_url}}" style="color:#6b7280;text-decoration:underline;">Se d\u00e9sinscrire</a></p>'
        '</td></tr>'
        '</table></td></tr></table></body></html>'
    )

def greeting(prenom):
    return '<tr><td style="padding:32px 40px 8px;"><p style="margin:0;color:#ffffff;font-size:18px;">Salut ' + prenom + ',</p></td></tr>'

def paragraph(text):
    return '<tr><td style="padding:4px 40px;"><p style="margin:0 0 12px;color:#d1d5db;font-size:15px;line-height:1.65;">' + text + '</p></td></tr>'

def bold_paragraph(text):
    return '<tr><td style="padding:4px 40px;"><p style="margin:0 0 12px;color:#ffffff;font-size:15px;line-height:1.65;font-weight:700;">' + text + '</p></td></tr>'

def highlight_box(text, accent):
    rgb = hex_to_rgb(accent)
    return '<tr><td style="padding:8px 40px;"><div style="background:rgba(' + rgb + ',0.08);border:1px solid rgba(' + rgb + ',0.2);border-radius:12px;padding:20px;"><p style="margin:0;color:#ffffff;font-size:15px;line-height:1.65;font-weight:600;">' + text + '</p></div></td></tr>'

def quote_box(text, accent):
    rgb = hex_to_rgb(accent)
    return '<tr><td style="padding:8px 40px;"><div style="border-left:3px solid ' + accent + ';padding:12px 20px;background:rgba(' + rgb + ',0.05);border-radius:0 8px 8px 0;"><p style="margin:0;color:#d1d5db;font-size:14px;line-height:1.6;font-style:italic;">' + text + '</p></div></td></tr>'

def cta_button(text, url, accent):
    return '<tr><td style="padding:24px 40px;text-align:center;"><a href="' + url + '" style="display:inline-block;background:' + accent + ';color:#000;font-weight:700;font-size:16px;padding:16px 40px;border-radius:12px;text-decoration:none;letter-spacing:0.3px;">' + text + '</a></td></tr>'

def separator():
    return '<tr><td style="padding:0 40px;"><div style="border-top:1px solid rgba(255,255,255,0.06);margin:8px 0;"></div></td></tr>'

def spacer(px):
    return '<tr><td style="padding:0 40px;height:' + str(px) + 'px;font-size:0;line-height:0;">&nbsp;</td></tr>'

def ps_block(text):
    return '<tr><td style="padding:4px 40px;"><p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.5;font-style:italic;">' + text + '</p></td></tr>'

def signature(sender='{sender}'):
    return '<tr><td style="padding:16px 40px 8px;"><p style="margin:0;color:#d1d5db;font-size:15px;">\u2014 ' + sender + '</p></td></tr>'

def proof_card(name, result, accent):
    rgb = hex_to_rgb(accent)
    return '<tr><td style="padding:6px 40px;"><div style="background:rgba(' + rgb + ',0.06);border:1px solid rgba(' + rgb + ',0.15);border-radius:10px;padding:16px 20px;"><p style="margin:0 0 4px;color:#ffffff;font-size:14px;font-weight:600;">' + name + '</p><p style="margin:0;color:' + accent + ';font-size:14px;font-weight:700;">' + result + '</p></div></td></tr>'

def list_item(number, text, accent):
    rgb = hex_to_rgb(accent)
    return '<tr><td style="padding:4px 40px;"><p style="margin:0 0 8px;color:#d1d5db;font-size:15px;line-height:1.6;"><span style="display:inline-block;width:28px;height:28px;line-height:28px;text-align:center;background:rgba(' + rgb + ',0.15);border-radius:8px;color:' + accent + ';font-weight:700;font-size:13px;margin-right:8px;">' + str(number) + '</span>' + text + '</p></td></tr>'

def check_item(text):
    return '<tr><td style="padding:3px 40px;"><p style="margin:0;color:#d1d5db;font-size:14px;line-height:1.6;">\u2705 ' + text + '</p></td></tr>'

def cross_item(text):
    return '<tr><td style="padding:3px 40px;"><p style="margin:0;color:#6b7280;font-size:14px;line-height:1.6;">\u274c ' + text + '</p></td></tr>'

def section_heading(emoji, title, accent):
    return '<tr><td style="padding:20px 40px 8px;"><h2 style="margin:0;color:' + accent + ';font-size:13px;text-transform:uppercase;letter-spacing:1.5px;">' + emoji + ' ' + title + '</h2></td></tr>'

def info_box(label, content_html, accent):
    rgb = hex_to_rgb(accent)
    return '<tr><td style="padding:8px 40px;"><div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:16px 20px;"><p style="margin:0 0 8px;color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:1px;">' + label + '</p>' + content_html + '</div><p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.5;text-align:center;"></p></td></tr>'

def chat_box(text, accent):
    rgb = hex_to_rgb(accent)
    return '<tr><td style="padding:8px 40px;"><div style="background:rgba(' + rgb + ',0.06);border:1px solid rgba(' + rgb + ',0.12);border-radius:10px;padding:16px 20px;text-align:center;"><p style="margin:0;color:' + accent + ';font-size:14px;">\U0001f4ac ' + text + '</p></div></td></tr>'

def big_quote(text, accent):
    rgb = hex_to_rgb(accent)
    return '<tr><td style="padding:12px 40px;"><div style="background:rgba(' + rgb + ',0.1);border-left:4px solid ' + accent + ';border-radius:0 12px 12px 0;padding:20px 24px;text-align:center;"><p style="margin:0;color:#ffffff;font-size:20px;font-weight:800;font-style:italic;">' + text + '</p></div></td></tr>'

def pill_box(label, text, accent):
    rgb = hex_to_rgb(accent)
    return '<tr><td style="padding:8px 40px;"><div style="background:rgba(' + rgb + ',0.06);border:1px solid rgba(' + rgb + ',0.2);border-radius:10px;padding:16px 20px;"><p style="margin:0 0 4px;"><span style="display:inline-block;width:28px;height:28px;line-height:28px;text-align:center;background:rgba(' + rgb + ',0.15);border-radius:8px;color:' + accent + ';font-weight:700;font-size:13px;">' + label + '</span></p><p style="margin:0 0 6px;color:#ffffff;font-size:15px;font-weight:700;">' + text + '</p></div></td></tr>'

def countdown_box(time_text, sub_text, accent):
    return '<tr><td style="padding:16px 40px;text-align:center;"><p style="margin:0;color:' + accent + ';font-size:36px;font-weight:800;letter-spacing:1px;">' + time_text + '</p><p style="margin:4px 0 0;color:#9ca3af;font-size:13px;text-transform:uppercase;letter-spacing:1px;">' + sub_text + '</p></td></tr>'

def launch_banner(text, accent):
    rgb = hex_to_rgb(accent)
    return '<tr><td style="padding:12px 40px;"><div style="background:rgba(' + rgb + ',0.12);border:2px solid ' + accent + ';border-radius:12px;padding:24px;text-align:center;"><p style="margin:0;color:' + accent + ';font-size:24px;font-weight:800;letter-spacing:0.5px;">' + text + '</p></div></td></tr>'

def accent_bold(text, accent):
    return '<span style="color:' + accent + ';font-weight:700;">' + text + '</span>'

def white_bold(text):
    return '<span style="color:#ffffff;font-weight:700;">' + text + '</span>'


# ============================================================
# EMAIL 1 — Pre Pre-Launch (Curiosité)
# Accent: violet #8b5cf6
# ============================================================



ACCENT = {1:"#8b5cf6", 2:"#f97316", 3:"#3b82f6", 4:"#4ade80", 5:"#facc15", 6:"#ef4444", 7:"#ef4444", 8:"#dc2626", 9:"#4ade80"}


def build_email_1(prenom):
    a = ACCENT[1]
    body = ''
    body += greeting(prenom)
    body += paragraph("Tu connais ça. Tu achètes une carte à 30&#8364; en te disant &#171; celle-là, je la revends facile 50&#8364; &#187;.")
    body += paragraph("Sauf que t&#39;as pas calculé les commissions. La livraison. L&#39;emballage.")
    body += highlight_box("Bénéfice réel : 8,50&#8364;. Dans le meilleur des cas.", a)
    body += paragraph("Moi, j&#39;ai fait ça trois fois. <span style=\"color:" + a + ";font-weight:700;\">200&#8364; perdus à chaque fois.</span> Pas parce que j&#39;étais bête. Parce que j&#39;avais pas de système.")
    body += separator()
    body += bold_paragraph("Toi, c&#39;est quoi l&#39;achat que tu regrettes le plus ?")
    body += chat_box("Réponds. Une phrase suffit. Je lis chaque réponse.", a)
    body += spacer(12)
    body += signature('Théo, CEO Pokévendre Pro')
    body += ps_block("P.S. La semaine prochaine, je te montre le chiffre que 90% des revendeurs ne calculent jamais — et qui change tout.")
    return {
        'subject': "Ta pire erreur en revente \U0001f4b8",
        'html': email_shell(a, "Le calcul que 90% des revendeurs ne font pas...", body),
        'text': "Salut " + prenom + ",\n\nTu connais ça. Tu achètes une carte à 30€ en te disant « celle-là, je la revends facile 50€ ».\n\nSauf que t'as pas calculé les commissions. La livraison. L'emballage.\n\nBénéfice réel : 8,50€. Dans le meilleur des cas.\n\nMoi, j'ai fait ça trois fois. 200€ perdus à chaque fois. Pas parce que j'étais bête. Parce que j'avais pas de système.\n\nToi, c'est quoi l'achat que tu regrettes le plus ?\n\nRéponds. Une phrase suffit. Je lis chaque réponse.\n\n— Théo, CEO Pokévendre Pro\n\nP.S. La semaine prochaine, je te montre le chiffre que 90% des revendeurs ne calculent jamais — et qui change tout."
    }



def build_email_2(prenom):
    a = ACCENT[2]
    body = ''
    body += greeting(prenom)
    body += paragraph("Dimanche dernier, je t&#39;ai demand&#233; ton erreur de revente.")
    body += paragraph("La r&#233;ponse la plus fr&#233;quente :")
    body += '<tr><td style="padding:12px 40px;"><div style="background:rgba(' + hex_to_rgb(a) + ',0.1);border-left:4px solid ' + a + ';border-radius:0 12px 12px 0;padding:20px 24px;text-align:center;"><p style="margin:0;color:#ffffff;font-size:20px;font-weight:800;font-style:italic;">&#171; J&#39;ai achet&#233; au feeling. &#187;</p></div></td></tr>'
    body += paragraph('Moi aussi. Un soir &#224; 2h du matin, je venais de perdre encore 200&#8364; sur une carte que j&#39;&#233;tais &#171; s&#251;r &#187; de revendre plus cher. Et l&#224;, j&#39;ai r&#233;alis&#233; : en 6 mois, j&#39;avais jamais eu de m&#233;thode. <span style="color:' + a + ';font-weight:700;">Juste de l&#39;espoir.</span>')
    body += paragraph("Le probl&#232;me, c&#39;est pas les cartes. C&#39;est pas le march&#233;.")
    body += bold_paragraph("C&#39;est qu&#39;il n&#39;y a pas de syst&#232;me.")
    body += bold_paragraph("C&#39;est pour &#231;a que je lance Pok&#233;vendre Pro.")
    body += paragraph('Tu sais quoi acheter, &#224; quel prix, et quand revendre. <span style="color:' + a + ';font-weight:700;">Plus de devinettes.</span>')
    body += proof_card('Sarah, maman de 2 enfants', '+400&#8364;/mois en 45 min le soir', a)
    body += paragraph('<span style="color:#9ca3af;font-size:13px;">Elle achetait les cartes que tout le monde recommandait sur les groupes Facebook. R&#233;sultat : elle revendait &#224; perte 2 fois sur 3. Elle pensait que c&#39;&#233;tait elle. C&#39;&#233;tait pas elle. C&#39;&#233;tait la m&#233;thode.</span>')
    body += paragraph('<span style="color:#9ca3af;font-size:13px;">Un jour, elle a appliqu&#233; le syst&#232;me avec 200&#8364;. Pas de feeling. Juste les r&#232;gles. Premier mois : elle a r&#233;cup&#233;r&#233; sa mise. Deuxi&#232;me : +210&#8364;. Aujourd&#39;hui : +400&#8364;/mois en 45 min le soir.</span>')
    body += bold_paragraph("Pas de la chance. Un syst&#232;me.")
    body += paragraph("Mais je pr&#233;viens : il y aura 50 places. Je r&#233;ponds personnellement dans la communaut&#233;. 50, je peux suivre. Plus, non.")
    body += separator()
    body += '<tr><td style="padding:8px 40px;"><div style="background:rgba(' + hex_to_rgb(a) + ',0.06);border:1px solid rgba(' + hex_to_rgb(a) + ',0.12);border-radius:10px;padding:16px 20px;text-align:center;"><p style="margin:0;color:' + a + ';font-size:14px;">\U0001f4ac Toi, tu fonctionnes plut&#244;t au feeling ou avec un syst&#232;me ?<br>R&#233;ponds-moi.</p></div></td></tr>'
    body += spacer(8)
    body += signature('Théo, CEO Pokévendre Pro')
    body += ps_block("P.S. La semaine prochaine, je te montre le pilier que 90% des revendeurs ignorent \u2014 et qui change tout.")
    return {
        'subject': "Pourquoi je lance \u00e7a \U0001f3af",
        'html': email_shell(a, "Le probl\u00e8me, c\u2019est pas les cartes...", body),
        'text': "Salut " + prenom + ",\n\nDimanche dernier, je t'ai demand\u00e9 ton erreur de revente.\n\nLa r\u00e9ponse la plus fr\u00e9quente :\n\n\u00ab J'ai achet\u00e9 au feeling. \u00bb\n\nMoi aussi. Un soir \u00e0 2h du matin, je venais de perdre encore 200\u20ac sur une carte que j'\u00e9tais \u00ab s\u00fbr \u00bb de revendre plus cher. Et l\u00e0, j'ai r\u00e9alis\u00e9 : en 6 mois, j'avais jamais eu de m\u00e9thode. Juste de l'espoir.\n\nLe probl\u00e8me, c'est pas les cartes. C'est pas le march\u00e9.\n\nC'est qu'il n'y a pas de syst\u00e8me.\n\nC'est pour \u00e7a que je lance Pok\u00e9vendre Pro. Tu sais quoi acheter, \u00e0 quel prix, et quand revendre. Plus de devinettes.\n\nSarah, maman de 2 enfants : +400\u20ac/mois en 45 min le soir.\n\nElle achetait les cartes que tout le monde recommandait sur les groupes Facebook. R\u00e9sultat : elle revendait \u00e0 perte 2 fois sur 3. Elle pensait que c'\u00e9tait elle. C'\u00e9tait pas elle. C'\u00e9tait la m\u00e9thode.\n\nUn jour, elle a appliqu\u00e9 le syst\u00e8me avec 200\u20ac. Pas de feeling. Juste les r\u00e8gles. Premier mois : elle a r\u00e9cup\u00e9r\u00e9 sa mise. Deuxi\u00e8me : +210\u20ac. Aujourd'hui : +400\u20ac/mois en 45 min le soir.\n\nPas de la chance. Un syst\u00e8me.\n\nMais je pr\u00e9viens : il y aura 50 places. Je r\u00e9ponds personnellement dans la communaut\u00e9. 50, je peux suivre. Plus, non.\n\nToi, tu fonctionnes plut\u00f4t au feeling ou avec un syst\u00e8me ? R\u00e9ponds-moi.\n\n\u2014 Th\u00e9o, CEO Pok\u00e9vendre Pro\n\nP.S. La semaine prochaine, je te montre le pilier que 90% des revendeurs ignorent \u2014 et qui change tout."
    }



def build_email_3(prenom):
    a = ACCENT[3]
    body = ''
    body += greeting(prenom)
    body += paragraph("Sarah \u2014 tu te souviens ? La maman qui achetait au feeling.")
    body += paragraph("Elle a appliqu\u00e9 UN seul pilier. Pas les 4. Juste un.")
    body += '<tr><td style="padding:12px 40px;"><div style="background:rgba(' + hex_to_rgb(a) + ',0.1);border-radius:12px;padding:20px;text-align:center;"><p style="margin:0;color:#ffffff;font-size:18px;font-weight:800;letter-spacing:0.5px;">R\u00e9sultat : elle a arr\u00eat\u00e9 de perdre de l&#39;argent 3 ventes sur 4.</p></div></td></tr>'
    body += spacer(8)
    body += paragraph("Lequel ? Avant chaque achat, il y a un chiffre. Si tu le regardes pas, tu joues. Si tu le regardes, tu sais.")
    body += paragraph("Pas au pif. Au chiffre.")
    body += paragraph("Moi aussi je jouais. J\u2019ai grill\u00e9 mes premi\u00e8res \u00e9conomies avant de comprendre \u00e7a.")
    body += bold_paragraph("Je te montre tout \u00e7a la semaine prochaine.")
    body += separator()
    body += chat_box("Mais avant \u2014 tu calcules ton profit r\u00e9el avant d&#39;acheter, ou tu ach\u00e8tes d&#39;abord et tu v\u00e9rifies apr\u00e8s ?<br>R\u00e9ponds \u00ab avant \u00bb ou \u00ab apr\u00e8s \u00bb.", a)
    body += spacer(8)
    body += signature('Th\u00e9o, CEO Pok\u00e9vendre Pro')
    body += ps_block("P.S. Sarah v\u00e9rifie un deuxi\u00e8me chiffre maintenant. Celui-l\u00e0, elle l&#39;a d\u00e9couvert apr\u00e8s avoir claqu\u00e9 200\u20ac sur une seule carte.")
    return {
'subject': "Le chiffre que tu ignores \U0001f527",
        'html': email_shell(a, "le chiffre que tu ignores", body),
'text': "Salut " + prenom + ",\n\nSarah \u2014 tu te souviens ? La maman qui achetait au feeling.\n\nElle a appliqu\u00e9 UN seul pilier. Pas les 4. Juste un.\n\nR\u00e9sultat : elle a arr\u00eat\u00e9 de perdre de l'argent 3 ventes sur 4.\n\nLequel ? Avant chaque achat, il y a un chiffre. Si tu le regardes pas, tu joues. Si tu le regardes, tu sais.\n\nPas au pif. Au chiffre.\n\nMoi aussi je jouais. J\u2019ai grill\u00e9 mes premi\u00e8res \u00e9conomies avant de comprendre \u00e7a.\n\nJe te montre tout \u00e7a la semaine prochaine.\n\nMais avant \u2014 tu calcules ton profit r\u00e9el avant d'acheter, ou tu ach\u00e8tes d'abord et tu v\u00e9rifies apr\u00e8s ?\n\nR\u00e9ponds \u00ab avant \u00bb ou \u00ab apr\u00e8s \u00bb.\n\n\u2014 Th\u00e9o, CEO Pok\u00e9vendre Pro\n\nP.S. Sarah v\u00e9rifie un deuxi\u00e8me chiffre maintenant. Celui-l\u00e0, elle l'a d\u00e9couvert apr\u00e8s avoir claqu\u00e9 200\u20ac sur une seule carte."
    }
def build_email_4(prenom):
    a = ACCENT[4]
    body = ''
    body += greeting(prenom)
    body += paragraph("J&#39;ai failli repousser l&#39;ouverture.")
    body += paragraph("50 places, c&#39;est 50 personnes que je devrai accompagner personnellement. Et &#231;a me terrifie autant que &#231;a m&#39;excite.")
    body += paragraph("Mais Sarah m&#39;a rappel&#233; pourquoi.")
    body += paragraph("Avant : deux pertes sur trois. Elle se disait qu&#39;elle &#233;tait juste pas faite pour &#231;a.")
    body += paragraph("Un seul pilier appliqu&#233; : 3 ventes sur 4 qui fonctionnent.")
    body += bold_paragraph("Imagine avec les 4.")
    body += launch_banner("🔓 POKÉVENDRE PRO EST OUVERT", a)
    body += cta_button("Rejoindre Pokévendre Pro →", "{lien_achat}", a)
    body += separator()
    price_block = '<tr><td style="padding:12px 40px;"><div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:20px;text-align:center;"><p style="margin:0;color:#ffffff;font-size:32px;font-weight:800;">{prix}€</p></div></td></tr>'
    body += price_block
    body += '<tr><td style="padding:16px 40px;text-align:center;"><p style="margin:0;color:' + a + ';font-size:20px;font-weight:800;">50 places. Pas 51.</p></td></tr>'
    
    body += spacer(8)
    body += signature("Théo, CEO Pokévendre Pro")
    body += ps_block("P.S. 12 places sont déjà réservées par les gens de la liste d'attente. Il en reste 38.")
    return {
        'subject': "C'est maintenant (" + prenom + ") 🔓",
'html': email_shell(a, "Pokévendre Pro est ouvert. 50 places.", body),
        'text': "Salut " + prenom + ",\n\nJ'ai failli repousser l'ouverture.\n\n50 places, c'est 50 personnes que je devrai accompagner personnellement. Et ça me terrifie autant que ça m'excite.\n\nMais Sarah m'a rappelé pourquoi.\n\nAvant : deux pertes sur trois. Elle se disait qu'elle était juste pas faite pour ça.\n\nUn seul pilier appliqué : 3 ventes sur 4 qui fonctionnent.\n\nImagine avec les 4.\n\n🔓 POKÉVENDRE PRO EST OUVERT\n\n→ Rejoindre Pokévendre Pro : {lien_achat}\n\n{prix}€\n\n50 places. Pas 51.\n\n— Théo, CEO Pokévendre Pro\nP.S. 12 places sont déjà réservées par les gens de la liste d'attente. Il en reste 38."
    }
def build_email_5(prenom):
    a = ACCENT[5]
    body = ''
    body += greeting(prenom)
    body += paragraph("Je dois te dire un truc.")
    body += paragraph("Pendant 6 mois, j&#39;ai perdu de l&#39;argent sur la revente Pok\u00e9mon. Pas un peu. <span style=\"color:#ffffff;font-weight:700;\">1 200\u20ac</span>.")
    body += paragraph("En achetant au feeling. En n\u00e9gligeant les frais. En \u00e9coutant les \u00ab bons plans \u00bb de Twitter.")
    body += paragraph("1 200\u20ac, c&#39;est 3 semaines de courses pour ma famille.")
    body += bold_paragraph("J&#39;aurais pu \u00e9viter \u00e7a.")
    body += paragraph("Les erreurs \u00e9taient \u00e9videntes. Mais je les voyais pas, parce que j&#39;avais pas de cadre. Pas de syst\u00e8me. Juste des intuitions et de l&#39;espoir.")
    body += separator()
    body += proof_card("Sarah", "\u00ab J&#39;ai perdu 300\u20ac en 2 mois. Puis j&#39;ai appliqu\u00e9 un seul pilier. Premier mois : j&#39;ai r\u00e9cup\u00e9r\u00e9 ma mise. Deuxi\u00e8me : +210\u20ac. \u00bb", a)
    body += paragraph("Moi aussi j&#39;ai fini par comprendre. Trop tard pour 1 200\u20ac. Pas trop tard pour toi.")
    body += cta_button("Rejoindre Pok\u00e9vendre Pro \u2192", "{lien_achat}", a)
    body += spacer(8)
    body += bold_paragraph("Il reste 30 places.")
    body += spacer(8)
    body += signature("Th\u00e9o, CEO Pok\u00e9vendre Pro")
    body += ps_block("P.S. Le truc qui m&#39;a co\u00fbt\u00e9 le plus cher ? C&#39;est pas une mauvaise carte. C&#39;est un r\u00e9flexe que j&#39;avais \u00e0 chaque achat \u2014 et que Sarah a cass\u00e9 en 30 secondes.")
    return {
        'subject': "J\u2019ai perdu 1 200\u20ac (" + prenom + ") \U0001f624",
        'html': email_shell(a, "j&#39;ai perdu 1 200\u20ac", body),
        'text': "Salut " + prenom + ",\n\nJe dois te dire un truc.\n\nPendant 6 mois, j'ai perdu 1 200\u20ac sur la revente Pok\u00e9mon.\n\nEn achetant au feeling. En n\u00e9gligeant les frais. En \u00e9coutant les \u00ab bons plans \u00bb de Twitter.\n\n1 200\u20ac, c'est 3 semaines de courses pour ma famille.\n\nJ'aurais pu \u00e9viter \u00e7a.\n\nLes erreurs \u00e9taient \u00e9videntes. Mais je les voyais pas, parce que j'avais pas de cadre. Pas de syst\u00e8me. Juste des intuitions et de l'espoir.\n\nSarah : 300\u20ac perdus en 2 mois. Puis elle a appliqu\u00e9 un seul pilier. Premier mois : elle a r\u00e9cup\u00e9r\u00e9 sa mise. Deuxi\u00e8me : +210\u20ac.\n\nMoi aussi j'ai fini par comprendre. Trop tard pour 1 200\u20ac. Pas trop tard pour toi.\n\nIl reste 30 places.\n\n\u2014 Th\u00e9o, CEO Pok\u00e9vendre Pro\nP.S. Le truc qui m'a co\u00fbt\u00e9 le plus cher ? C'est pas une mauvaise carte. C'est un r\u00e9flexe que j'avais \u00e0 chaque achat \u2014 et que Sarah a cass\u00e9 en 30 secondes."
    }


def build_email_6(prenom):
    a = ACCENT[6]
    body = ''
    body += greeting(prenom)
    body += paragraph("Depuis lundi, une question revient en boucle.")
    body += '<tr><td style="padding:12px 40px;"><div style="background:rgba(' + hex_to_rgb(a) + ',0.1);border-left:4px solid ' + a + ';border-radius:0 12px 12px 0;padding:20px 24px;text-align:center;"><p style="margin:0;color:#ffffff;font-size:18px;font-weight:800;">« Est-ce que \u00e7a marche si je d\u00e9bute de z\u00e9ro ? »</p></div></td></tr>'
    body += spacer(8)
    body += paragraph("J&#39;ai commenc\u00e9 en achetant 3 cartes au hasard sur Vinted. J&#39;ai perdu 45\u20ac le premier mois. Pas parce que j&#39;avais pas de feeling \u2014 j&#39;avais pas de m\u00e9thode.")
    body += paragraph("Sarah non plus n&#39;avait jamais revendu. Son premier achat ? Un Mewtwo \u00e0 12\u20ac qui valait 8\u20ac. Elle a perdu 4\u20ac. Puis elle a appliqu\u00e9 le premier pilier. Premier mois : elle a r\u00e9cup\u00e9r\u00e9 sa mise. Deuxi\u00e8me : +210\u20ac.")
    body += paragraph("Le syst\u00e8me est fait pour les gens qui partent de rien. C&#39;est m\u00eame pour \u00e7a qu&#39;il existe.")
    body += separator()
    body += section_heading("\u23f0", "Il reste moins de 48H", a)
    body += bold_paragraph("Apr\u00e8s, c&#39;est ferm\u00e9.")
    body += cta_button("Rejoindre Pok\u00e9vendre Pro \u2192", "{lien_achat}", a)
    body += spacer(8)
    body += bold_paragraph("Il reste 22 places.")
    body += spacer(8)
    body += signature("Th\u00e9o, CEO Pok\u00e9vendre Pro")
    body += ps_block("P.S. Le premier qui m&#39;a \u00e9crit ? Un gars qui n&#39;avait jamais touch\u00e9 une carte Pok\u00e9mon de sa vie. Il m&#39;a pos\u00e9 7 questions en un seul message.")
    return {
        'subject': "La question qui revient tout le temps \U0001f64b",
        'html': email_shell(a, "la question qui revient tout le temps", body),
        'text': "Salut " + prenom + ",\n\nDepuis lundi, une question revient en boucle.\n\n« Est-ce que \u00e7a marche si je d\u00e9bute de z\u00e9ro ? »\n\nJ'ai commenc\u00e9 en achetant 3 cartes au hasard sur Vinted. J'ai perdu 45\u20ac le premier mois. Pas parce que j'avais pas de feeling \u2014 j'avais pas de m\u00e9thode.\n\nSarah non plus n'avait jamais revendu. Son premier achat ? Un Mewtwo \u00e0 12\u20ac qui valait 8\u20ac. Elle a perdu 4\u20ac. Puis elle a appliqu\u00e9 le premier pilier. Premier mois : elle a r\u00e9cup\u00e9r\u00e9 sa mise. Deuxi\u00e8me : +210\u20ac.\n\nLe syst\u00e8me est fait pour les gens qui partent de rien. C'est m\u00eame pour \u00e7a qu'il existe.\n\n\u23f0 Il reste moins de 48H.\nApr\u00e8s, c'est ferm\u00e9.\n\nIl reste 22 places.\n\n\u2014 Th\u00e9o, CEO Pok\u00e9vendre Pro\nP.S. Le premier qui m'a \u00e9crit ? Un gars qui n'avait jamais touch\u00e9 une carte Pok\u00e9mon de sa vie. Il m'a pos\u00e9 7 questions en un seul message."
    }


def build_email_7(prenom):
    a = ACCENT[7]
    body = ''
    body += greeting(prenom)
    body += paragraph("C&#39;est le dernier jour.")
    body += '<tr><td style="padding:16px 40px;text-align:center;"><p style="margin:0;color:' + a + ';font-size:36px;font-weight:800;letter-spacing:1px;">4</p><p style="margin:4px 0 0;color:#9ca3af;font-size:13px;text-transform:uppercase;letter-spacing:1px;">places restantes</p></td></tr>'
    body += separator()
    body += paragraph("Ceux qui ont rejoint ne sont pas des experts. Sarah n&#39;avait jamais revendu. Le gars qui m&#39;a pos\u00e9 7 questions n&#39;avait jamais touch\u00e9 une carte. Ils ont juste arr\u00eat\u00e9 de deviner.")
    body += paragraph("Moi aussi j&#39;ai h\u00e9sit\u00e9 avant mon premier achat. 200\u20ac sur une carte que j&#39;\u00e9tais pas s\u00fbr de revendre. J&#39;ai v\u00e9rifi\u00e9 3 fois le calculateur avant de cliquer. Et j&#39;ai gagn\u00e9 12\u20ac. Pas de quoi changer de vie. Mais j&#39;ai su que le syst\u00e8me marchait.")
    body += cta_button("Rejoindre Pok\u00e9vendre Pro \u2192", "{lien_achat}", a)
    body += spacer(12)
    body += signature("Th\u00e9o, CEO Pok\u00e9vendre Pro")
    body += ps_block("P.S. Sarah a failli ne pas rejoindre. La raison ? C&#39;est probablement la tienne.")
    return {
        'subject': "Dernier jour (" + prenom + ") \u23f3",
        'html': email_shell(a, "dernier jour", body),
        'text': "Salut " + prenom + ",\n\nC'est le dernier jour.\n\n4 places restantes.\n\nCeux qui ont rejoint ne sont pas des experts. Sarah n'avait jamais revendu. Le gars qui m'a pos\u00e9 7 questions n'avait jamais touch\u00e9 une carte. Ils ont juste arr\u00eat\u00e9 de deviner.\n\nMoi aussi j'ai h\u00e9sit\u00e9 avant mon premier achat. 200\u20ac sur une carte que j'\u00e9tais pas s\u00fbr de revendre. J'ai v\u00e9rifi\u00e9 3 fois le calculateur avant de cliquer. Et j'ai gagn\u00e9 12\u20ac. Pas de quoi changer de vie. Mais j'ai su que le syst\u00e8me marchait.\n\n\u2014 Th\u00e9o, CEO Pok\u00e9vendre Pro\nP.S. Sarah a failli ne pas rejoindre. La raison ? C'est probablement la tienne."
    }


def build_email_8(prenom):
    a = ACCENT[8]
    body = ''
    body += greeting(prenom)
    body += paragraph("Ce soir, \u00e7a ferme. Pas de buzz. Juste un fait.")
    body += paragraph("Je ne peux pas accompagner plus de 50 personnes et rester disponible dans la communaut\u00e9. 46 ont rejoint. C\u2019est d\u00e9j\u00e0 beaucoup.")
    body += paragraph("Le gars qui m\u2019a pos\u00e9 7 questions avant de signer ? Il m\u2019en a pos\u00e9 une 8e hier. Pas sur le syst\u00e8me. Sur la carte qu\u2019il venait de revendre. Il voulait \u00eatre s\u00fbr d\u2019avoir bien appliqu\u00e9 la m\u00e9thode.")
    body += paragraph("C\u2019est \u00e7a que je veux prot\u00e9ger. Ce genre d\u2019attention. Pas un groupe de 200 personnes o\u00f9 plus personne ne lit.")
    body += paragraph("Si t\u2019es pas pr\u00eat, c\u2019est OK. Mais si tu veux un syst\u00e8me au lieu d\u2019un feeling \u2014")
    body += cta_button("Rejoindre Pok\u00e9vendre Pro \u2192", "{lien_achat}", a)
    body += spacer(12)
    body += signature("Th\u00e9o, CEO Pok\u00e9vendre Pro")
    body += ps_block("P.S. 4 places. Le premier qui m'a écrit n'avait jamais touché une carte. 72h après, il m'envoyait une capture de sa première vente.")
    return {
        'subject': "\u00c7a ferme ce soir (" + prenom + ") \U0001f56f",
        'html': email_shell(a, "\u00e7a ferme ce soir", body),
        'text': "Salut " + prenom + ",\n\nCe soir, \u00e7a ferme. Pas de buzz. Juste un fait.\n\nJe ne peux pas accompagner plus de 50 personnes et rester disponible dans la communaut\u00e9. 46 ont rejoint. C\u2019est d\u00e9j\u00e0 beaucoup.\n\nLe gars qui m\u2019a pos\u00e9 7 questions avant de signer ? Il m\u2019en a pos\u00e9 une 8e hier. Pas sur le syst\u00e8me. Sur la carte qu\u2019il venait de revendre. Il voulait \u00eatre s\u00fbr d\u2019avoir bien appliqu\u00e9 la m\u00e9thode.\n\nC\u2019est \u00e7a que je veux prot\u00e9ger. Ce genre d\u2019attention. Pas un groupe de 200 personnes o\u00f9 plus personne ne lit.\n\nSi t\u2019es pas pr\u00eat, c\u2019est OK. Mais si tu veux un syst\u00e8me au lieu d\u2019un feeling \u2014\n\n\u2014 Th\u00e9o, CEO Pok\u00e9vendre Pro\nP.S. 4 places. Apr\u00e8s, le formulaire se ferme."
    }


def build_email_9(prenom):
    a = ACCENT[9]
    body = ''
    body += greeting(prenom)
    body += paragraph("Bienvenue dans Pok\u00e9vendre Pro.")
    body += '<tr><td style="padding:12px 40px;"><div style="background:rgba(' + hex_to_rgb(a) + ',0.12);border:2px solid ' + a + ';border-radius:12px;padding:24px;text-align:center;"><p style="margin:0;color:' + a + ';font-size:22px;font-weight:800;">\u2705 Tu as fait le bon choix.</p></div></td></tr>'
    body += spacer(8)
    body += paragraph("Pas le choix facile. Le bon choix. Celui qui change la donne.")
    body += section_heading("\U0001f4e5", "Tes prochains pas", a)
    body += list_item("1", "Check tes emails — tu vas recevoir ton acc\u00e8s dans les prochaines minutes", a)
    body += list_item("2", "Commence par le Module 1 — les fondamentaux", a)
    body += list_item("3", "Utilise le calculateur de spread sur ta prochaine carte", a)
    body += list_item("4", "Rejoins la communaut\u00e9 — pr\u00e9sente-toi et dis-nous ton objectif", a)
    body += spacer(8)
    body += highlight_box("Conseil : ne saute pas d&#39;\u00e9tape. Le Module 1 prend 30 minutes. Apr\u00e8s \u00e7a, tu sauras exactement quoi chercher sur Vinted ou eBay.", a)
    body += separator()
    body += section_heading("\U0001f64c", "Ce que les autres en disent", a)
    body += proof_card("Sarah", "\u00ab J&#39;ai commenc\u00e9 le soir m\u00eame. 3 jours apr\u00e8s, premier achat rentable. \u00bb", a)
    body += proof_card("Mehdi", "\u00ab Le calculateur m&#39;a sauv\u00e9 d&#39;un mauvais achat d\u00e8s le premier jour. D\u00e9j\u00e0 rentable. \u00bb", a)
    body += spacer(8)
    body += paragraph("Tu n&#39;es pas seul l\u00e0-dedans. La communaut\u00e9 est active, et je r\u00e9ponds personnellement aux questions.")
    body += separator()
    body += '<tr><td style="padding:8px 40px;"><div style="background:rgba(' + hex_to_rgb(a) + ',0.06);border:1px solid rgba(' + hex_to_rgb(a) + ',0.12);border-radius:10px;padding:16px 20px;text-align:center;"><p style="margin:0;color:' + a + ';font-size:14px;">\U0001f4ac Une question ? R\u00e9ponds \u00e0 cet email. Je suis l\u00e0.</p></div></td></tr>'
    body += spacer(12)
    body += bold_paragraph("Bienvenue dans le syst\u00e8me.")
    body += signature()
    return {
        'subject': "\u2705 Bienvenue dans le syst\u00e8me (" + prenom + ")",
        'html': email_shell(a, "Tes 4 prochains pas...", body),
        'text': "Salut " + prenom + ",\n\nBienvenue dans Pok\u00e9vendre Pro.\n\n\u2705 Tu as fait le bon choix.\n\nTes prochains pas :\n1. Check tes emails — ton acc\u00e8s arrive\n2. Commence par le Module 1\n3. Utilise le calculateur de spread\n4. Rejoins la communaut\u00e9\n\nTu n'es pas seul. Je r\u00e9ponds personnellement aux questions.\n\nBienvenue dans le syst\u00e8me.\n\n\u2014 {sender}"
    }


# ============================================================
# DISPATCHER
# ============================================================

def build_purchase_email(prenom, days_until_access):
    """Email adaptatif post-achat. 
    days_until_access: nombre de jours avant l'ouverture (J+LAUNCH_DAY_OFFSET du lead).
    Si 0 ou negatif = acces immediat.
    """
    a = "#4ade80"  # vert pour confirmation
    
    if days_until_access > 0:
        # PRECOMMANDE - acces dans X jours
        subject = "✅ Confirmation — Ton accès arrive dans " + str(days_until_access) + " jour" + ("" if days_until_access == 1 else "s")
        preview = "Précommande confirmée. Prépare-toi."
        
        body = ""
        body += '<tr><td style="padding:24px 40px 8px;"><p style="margin:0;font-size:22px;color:#ffffff;font-weight:800;">✅ C\'est confirmé, ' + prenom + '.</p></td></tr>'
        body += '<tr><td style="padding:8px 40px;"><p style="margin:0;color:#d1d5db;font-size:15px;line-height:1.7;">Tu as pris la meilleure décision pour ta revente. Pas de doute possible.</p></td></tr>'
        body += '<tr><td style="padding:16px 40px;"><div style="background:rgba(74,222,128,0.08);border:1px solid rgba(74,222,128,0.2);border-radius:12px;padding:20px;text-align:center;"><p style="margin:0 0 4px;color:#4ade80;font-size:14px;text-transform:uppercase;letter-spacing:1px;">Ton accès ouvre dans</p><p style="margin:0;color:#ffffff;font-size:36px;font-weight:800;">' + str(days_until_access) + ' jour' + ("" if days_until_access == 1 else "s") + '</p></div></td></tr>'
        body += '<tr><td style="padding:16px 40px 8px;">' + section_heading("🎯", "En attendant, fais ça", a) + '</td></tr>'
        body += '<tr><td style="padding:8px 40px;"><p style="margin:0 0 12px;color:#d1d5db;font-size:15px;line-height:1.7;">Pas la peine d\'attendre sans rien faire. Voici ce que tu peux faire dès maintenant :</p></td></tr>'
        body += check_item("Ouvre Vinted et repère 3 cartes Pokémon qui t\'intéressent")
        body += check_item("Regarde les prix de vente ET les frais — note-le")
        body += check_item("Identifie 1 carte en dessous du prix marché — tu auras un avantage le jour J")
        body += '<tr><td style="padding:16px 40px;"><div style="background:rgba(74,222,128,0.06);border:1px solid rgba(74,222,128,0.12);border-radius:10px;padding:16px 20px;"><p style="margin:0;color:#9ca3af;font-size:14px;line-height:1.6;">💡 Le jour où tu auras accès, tu sauras exactement si cette carte vaut le coup. Le calculateur te le dira en 30 secondes.</p></div></td></tr>'
        body += '<tr><td style="padding:20px 40px 8px;"><p style="margin:0;color:#d1d5db;font-size:15px;line-height:1.7;">On se retrouve dans ' + str(days_until_access) + ' jour' + ("" if days_until_access == 1 else "s") + '.</p></td></tr>'
        body += '<tr><td style="padding:8px 40px;"><p style="margin:0;color:#9ca3af;font-size:14px;">— Jean, community manager à Pokévendre Pro</p></td></tr>'
        
        text = "Salut " + prenom + ",\n\nC\'est confirmé. Tu as pris la meilleure décision pour ta revente.\n\nTon accès ouvre dans " + str(days_until_access) + " jour" + ("" if days_until_access == 1 else "s") + ".\n\nEn attendant, fais ça :\n- Ouvre Vinted et repère 3 cartes qui t\'intéressent\n- Regarde les prix de vente ET les frais\n- Identifie 1 carte en dessous du prix marché\n\nLe jour J, tu sauras exactement si cette carte vaut le coup. Le calculateur te le dira en 30 secondes.\n\nOn se retrouve dans " + str(days_until_access) + " jour" + ("" if days_until_access == 1 else "s") + ".\n\n— Jean, community manager à Pokévendre Pro"
    else:
        # ACCES IMMEDIAT
        subject = "✅ Bienvenue dans le système, " + prenom
        preview = "Ton accès est actif. C\'est parti."
        
        body = ""
        body += '<tr><td style="padding:24px 40px 8px;"><p style="margin:0;font-size:22px;color:#ffffff;font-weight:800;">✅ Bienvenue, ' + prenom + '.</p></td></tr>'
        body += '<tr><td style="padding:8px 40px;"><p style="margin:0;color:#d1d5db;font-size:15px;line-height:1.7;">Ton accès est actif. Tu fais partie des 23.</p></td></tr>'
        body += '<tr><td style="padding:16px 40px;"><div style="background:rgba(74,222,128,0.08);border:1px solid rgba(74,222,128,0.2);border-radius:12px;padding:20px;text-align:center;"><p style="margin:0 0 4px;color:#4ade80;font-size:14px;text-transform:uppercase;letter-spacing:1px;">Accès</p><p style="margin:0;color:#ffffff;font-size:24px;font-weight:800;">Activé maintenant</p></div></td></tr>'
        body += '<tr><td style="padding:16px 40px 8px;">' + section_heading("🚀", "Tes 4 premiers pas", a) + '</td></tr>'
        body += check_item("Ouvre le calculateur de spread — c\'est le cœur du système")
        body += check_item("Tape une carte que tu as repérée — vois le profit réel en 30 secondes")
        body += check_item("Vérifie les keywords et seuils d\'achat mis à jour ce mois-ci")
        body += check_item("Présente-toi dans le groupe communautaire")
        body += '<tr><td style="padding:16px 40px;"><p style="margin:0;color:#d1d5db;font-size:15px;line-height:1.7;">Tu n\'as plus besoin de deviner. Le système est là.</p></td></tr>'
        body += '<tr><td style="padding:8px 40px;"><p style="margin:0;color:#9ca3af;font-size:14px;">— Jean, community manager à Pokévendre Pro</p></td></tr>'
        
        text = "Salut " + prenom + ",\n\nBienvenue dans le système. Ton accès est acité. Tu fais partie des 23.\n\nTes 4 premiers pas :\n1. Ouvre le calculateur de spread\n2. Tape une carte que tu as repérée\n3. Vérifie les keywords et seuils d\'achat\n4. Présente-toi dans le groupe communautaire\n\nTu n\'as plus besoin de deviner. Le système est là.\n\n— Jean, community manager à Pokévendre Pro"
    
    return {
        'subject': subject,
        'html': email_shell(a, preview, body),
        'text': text
    }

def build_reserve_email(prenom, days_until_access):
    """Email de confirmation de réservation (waitlist gratuite).
    days_until_access: nombre de jours avant l'ouverture (J+LAUNCH_DAY_OFFSET du lead).
    Si 0 ou negatif = ouverture imminente.
    """
    a = "#4ade80"  # vert pour confirmation

    if days_until_access > 0:
        # RESERVATION - ouverture dans X jours
        subject = "🎟️ Place réservée — Ouverture dans " + str(days_until_access) + " jour" + ("" if days_until_access == 1 else "s")
        preview = "Ta place est réservée. Voici ce qui arrive."

        body = ""
        body += '<tr><td style="padding:24px 40px 8px;"><p style="margin:0;font-size:22px;color:#ffffff;font-weight:800;">🎟️ C\'est fait, ' + prenom + '.</p></td></tr>'
        body += '<tr><td style="padding:8px 40px;"><p style="margin:0;color:#d1d5db;font-size:15px;line-height:1.7;">Ta place est réservée. Tu fais partie des premiers — et tu seras prévenu avant tout le monde.</p></td></tr>'
        body += '<tr><td style="padding:16px 40px;"><div style="background:rgba(74,222,128,0.08);border:1px solid rgba(74,222,128,0.2);border-radius:12px;padding:20px;text-align:center;"><p style="margin:0 0 4px;color:#4ade80;font-size:14px;text-transform:uppercase;letter-spacing:1px;">Ouverture dans</p><p style="margin:0;color:#ffffff;font-size:36px;font-weight:800;">' + str(days_until_access) + ' jour' + ("" if days_until_access == 1 else "s") + '</p></div></td></tr>'
        body += '<tr><td style="padding:16px 40px 8px;">' + section_heading("🎯", "En attendant, prépare-toi", a) + '</td></tr>'
        body += '<tr><td style="padding:8px 40px;"><p style="margin:0 0 12px;color:#d1d5db;font-size:15px;line-height:1.7;">Pas la peine d\'attendre sans rien faire. Voici 3 actions concrètes dès maintenant :</p></td></tr>'
        body += check_item("Ouvre Vinted et repère 3 cartes Pokémon qui t\'intéressent")
        body += check_item("Regarde les prix de vente ET les frais — note-le")
        body += check_item("Identifie 1 carte en dessous du prix marché — tu auras un avantage le jour J")
        body += '<tr><td style="padding:16px 40px;"><div style="background:rgba(74,222,128,0.06);border:1px solid rgba(74,222,128,0.12);border-radius:10px;padding:16px 20px;"><p style="margin:0;color:#9ca3af;font-size:14px;line-height:1.6;">💡 Le jour où ça ouvre, tu sauras exactement si cette carte vaut le coup. Le calculateur te le dira en 30 secondes.</p></div></td></tr>'
        body += '<tr><td style="padding:20px 40px 8px;"><p style="margin:0;color:#d1d5db;font-size:15px;line-height:1.7;">On se retrouve dans ' + str(days_until_access) + ' jour' + ("" if days_until_access == 1 else "s") + '. Tu recevras un email le jour J.</p></td></tr>'
        body += '<tr><td style="padding:8px 40px;"><p style="margin:0;color:#9ca3af;font-size:14px;">— Jean, community manager à Pokévendre Pro</p></td></tr>'

        text = "Salut " + prenom + ",\n\nTa place est réservée. Tu fais partie des premiers — et tu seras prévenu avant tout le monde.\n\nOuverture dans " + str(days_until_access) + " jour" + ("" if days_until_access == 1 else "s") + ".\n\nEn attendant, prépare-toi :\n- Ouvre Vinted et repère 3 cartes qui t'intéressent\n- Regarde les prix de vente ET les frais\n- Identifie 1 carte en dessous du prix marché\n\nLe jour J, le calculateur te dira en 30 secondes si elle vaut le coup.\n\nTu recevras un email le jour J.\n\n— Jean, community manager à Pokévendre Pro"
    else:
        # OUVERTURE IMMINENTE
        subject = "🎟️ Place réservée — Ça ouvre très vite"
        preview = "Ta place est réservée. L'ouverture est imminente."

        body = ""
        body += '<tr><td style="padding:24px 40px 8px;"><p style="margin:0;font-size:22px;color:#ffffff;font-weight:800;">🎟️ C\'est fait, ' + prenom + '.</p></td></tr>'
        body += '<tr><td style="padding:8px 40px;"><p style="margin:0;color:#d1d5db;font-size:15px;line-height:1.7;">Ta place est réservée. L\'ouverture est imminente — tu seras prévenu en premier.</p></td></tr>'
        body += '<tr><td style="padding:16px 40px;"><div style="background:rgba(74,222,128,0.08);border:1px solid rgba(74,222,128,0.2);border-radius:12px;padding:20px;text-align:center;"><p style="margin:0 0 4px;color:#4ade80;font-size:14px;text-transform:uppercase;letter-spacing:1px;">Statut</p><p style="margin:0;color:#ffffff;font-size:24px;font-weight:800;">Ouverture imminente 🔥</p></div></td></tr>'
        body += '<tr><td style="padding:16px 40px 8px;">' + section_heading("⚡", "Prépare-toi maintenant", a) + '</td></tr>'
        body += check_item("Ouvre Vinted et repère 3 cartes Pokémon qui t\'intéressent")
        body += check_item("Regarde les prix de vente ET les frais — note-le")
        body += check_item("Identifie 1 carte en dessous du prix marché")
        body += '<tr><td style="padding:16px 40px;"><p style="margin:0;color:#d1d5db;font-size:15px;line-height:1.7;">Surveille ta boîte mail. Le calculateur arrive.</p></td></tr>'
        body += '<tr><td style="padding:8px 40px;"><p style="margin:0;color:#9ca3af;font-size:14px;">— Jean, community manager à Pokévendre Pro</p></td></tr>'

        text = "Salut " + prenom + ",\n\nTa place est réservée. L'ouverture est imminente — tu seras prévenu en premier.\n\nPrépare-toi maintenant :\n- Ouvre Vinted et repère 3 cartes qui t'intéressent\n- Regarde les prix de vente ET les frais\n- Identifie 1 carte en dessous du prix marché\n\nSurveille ta boîte mail. Le calculateur arrive.\n\n— Jean, community manager à Pokévendre Pro"

    return {
        'subject': subject,
        'html': email_shell(a, preview, body),
        'text': text
    }


def get_email_content(email_number, prenom, **kwargs):
    """Return email dict with subject, html, text for the given email number (1-9).
    
    kwargs can include: lien_achat, prix, date_fermeture, sender
    """
    builders = {
        1: build_email_1,
        2: build_email_2,
        3: build_email_3,
        4: build_email_4,
        5: build_email_5,
        6: build_email_6,
        7: build_email_7,
        8: build_email_8,
        9: build_email_9,
    }
    
    if email_number not in builders:
        raise ValueError(f"Email {email_number} not found. Must be 1-9.")
    
    result = builders[email_number](prenom)
    
    # Replace placeholders
    for key in ('subject', 'html', 'text'):
        if key in result:
            result[key] = result[key].replace('{lien_achat}', kwargs.get('lien_achat', 'https://buy.stripe.com/4gM9AScw480n3778sP4gg01'))
            result[key] = result[key].replace('{prix}', str(kwargs.get('prix', '')))
            result[key] = result[key].replace('{date_fermeture}', kwargs.get('date_fermeture', ''))
            result[key] = result[key].replace('{sender}', kwargs.get('sender', 'Jean, community manager à Pokévendre Pro'))
    
    return result
