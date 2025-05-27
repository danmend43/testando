import fetch from 'node-fetch';

export default async function handler(req, res) {
  const code = req.query.code || null;
  const client_id = process.env.CLIENT_ID; // ajuste para seu env var
  const client_secret = process.env.CLIENT_SECRET;
  const redirect_uri = process.env.REDIRECT_URI;

  if (!code) {
    res.status(400).send('Code not found in query');
    return;
  }

  // Monta body para a troca do código pelo token
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri,
    client_id,
    client_secret,
  });

  try {
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!tokenRes.ok) {
      const error = await tokenRes.json();
      res.status(tokenRes.status).json(error);
      return;
    }

    const data = await tokenRes.json();

    // data: { access_token, token_type, expires_in, refresh_token, scope }

    // Redireciona para frontend passando os tokens na query string
    const params = new URLSearchParams({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in.toString(),
    });

    res.writeHead(302, {
      Location: `${process.env.FRONTEND_URI}?${params.toString()}`,
    });
    res.end();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
