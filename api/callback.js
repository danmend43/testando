// /api/callback.js
export default function handler(req, res) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Spotify Callback</title>
</head>
<body>
  <script>
    // Pega o hash da URL (#access_token=...)
    const hash = window.location.hash.substring(1);
    // Redireciona para a raiz passando os tokens na query string
    window.location.href = '/?' + hash;
  </script>
  <p>Redirecionando...</p>
</body>
</html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
}
