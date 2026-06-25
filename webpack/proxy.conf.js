function setupProxy({ tls }) {
  const serverResources = ['/api', '/services', '/management', '/v3/api-docs', '/h2-console', '/health'];

  // Sert-specific endpoints — served by cruscotto-sert-backend on port 8081
  const sertResources = ['/api/search', '/api/position', '/api/token', '/api/extra', '/api/transfers', '/api/workflows'];

  return [
    {
      context: sertResources,
      target: `http${tls ? 's' : ''}://localhost:8081`,
      secure: false,
      changeOrigin: tls,
    },
    {
      context: serverResources,
      target: `http${tls ? 's' : ''}://localhost:8080`,
      secure: false,
      changeOrigin: tls,
    },
  ];
}

module.exports = setupProxy;
