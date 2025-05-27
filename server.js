require('dotenv').config();
const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const cors = require('cors');

const app = express();
app.use(cors());

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;
const frontend_uri = process.env.FRONTEND_URI;

app.get('/login', (req, res) => {
  const scopes = 'user-read-currently-playing user-read-playback-state';
  const auth_query_params = querystring.stringify({
    response_type: 'code',
    client_id,
    scope: scopes,
    redirect_uri
  });

  res.redirect(`https://accounts.spotify.com/authorize?${auth_query_params}`);
});

app.get('/callback-backend', async (req, res) => {
  const code = req.query.code || null;
  if (!code) return res.send('No code received');

  try {
    const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
      code,
      redirect_uri,
      grant_type: 'authorization_code'
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
      }
    });

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    // Redireciona para o frontend com os tokens no hash da URL
    const query = querystring.stringify({
      access_token,
      refresh_token,
      expires_in
    });

    res.redirect(`${frontend_uri}?${query}`);
  } catch (error) {
    console.error('Erro ao trocar código por token:', error.response.data);
    res.status(400).send('Erro ao trocar código por token');
  }
});

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
