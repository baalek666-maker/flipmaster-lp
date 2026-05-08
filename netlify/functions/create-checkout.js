const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const profil = body.profil || '';
    const prenom = body.prenom || '';
    const email = body.email || '';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
     price: 'price_1TRSR1BN29xndj7q6Cddoojl',
     quantity: 1,
        },
      ],
      success_url: 'https://pokevendrepro.com/acces?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://pokevendrepro.com/',
      customer_email: email || undefined,
      metadata: {
        profil: profil,
        prenom: prenom,
        source: 'quiz'
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    });

    return {
      statusCode: 200,
      headers: {
     'Access-Control-Allow-Origin': '*',
     'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ url: session.url })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
     'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
