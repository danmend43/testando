export default function handler(req, res) {
  const client_id = process.env.CLIENT_ID;
  const redirect_uri = process.env.REDIRECT_URI;
  const scopes = [
    'user-read-playback-state',
    'user-read-currently-playing',
  ].join(' ');

  const authEndpoint = 'https://accounts.spotify.com/authorize';

  const url =
    authEndpoint +
    '?response_type=code' +
    `&client_id=${encodeURIComponent(client_id)}` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&redirect_uri=${encodeURIComponent(redirect_uri)}` +
    '&show_dialog=true';

  res.writeHead(302, { Location: url });
  res.end();
}
