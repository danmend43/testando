export default function handler(req, res) {
  const client_id = process.env.CLIENT_ID;
 const redirect_uri = 'https://testando-pp9x.vercel.app/api/callback';

  const scopes = [
    'user-read-playback-state',
    'user-read-currently-playing',
    // adicione outros escopos que precisar
  ].join(' ');

  const authEndpoint = 'https://accounts.spotify.com/authorize';

  const url =
    authEndpoint +
    '?response_type=token' +
    `&client_id=${encodeURIComponent(client_id)}` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&redirect_uri=${encodeURIComponent(redirect_uri)}` +
    '&show_dialog=true';

  res.writeHead(302, { Location: url });
  res.end();
}
