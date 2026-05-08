const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, webhookSecret);
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Webhook signature verification failed' })
    };
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;
    const customerEmail = session.customer_details?.email || '';
    const customerName = session.customer_details?.name || '';
    const profil = session.metadata?.profil || '';
    const prenom = session.metadata?.prenom || session.metadata?.first_name || customerName.split(' ')[0] || '';

    // Send confirmation email via Gmail SMTP
    // We'll use the existing self-hosted API to send the purchase confirmation email
    try {
      await fetch('https://api.pokevendrepro.com/send-purchase-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: customerEmail,
          prenom: prenom,
          profil: profil,
          session_id: session.id
        })
      });
    } catch (emailErr) {
      console.error('Failed to send purchase email:', emailErr.message);
      // Don't fail the webhook - Stripe will retry
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true })
  };
};
