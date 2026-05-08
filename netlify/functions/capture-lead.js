import { google } from 'googleapis';

export default async function handler(event) {
  // Only accept POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { prenom, email, profil, q1, q3, q7 } = JSON.parse(event.body || '{}');

    // Validate required fields
    if (!email || !prenom) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email et prénom requis' }),
      };
    }

    // Auth with service account or OAuth refresh token
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    auth.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const now = new Date().toISOString();
    const values = [[now, prenom, email, profil || '', q1 || '', q3 || '', q7 || '']];

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'A1:G1',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Lead capture error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erreur serveur' }),
    };
  }
}