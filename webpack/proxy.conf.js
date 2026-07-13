function setupProxy({ tls }) {
  const serverResources = ['/api', '/services', '/management', '/v3/api-docs', '/h2-console', '/health'];

  // Sert-specific endpoints — served by cruscotto-sert-backend on port 8081
  // Uses a function filter so these specific /api/* paths don't fall through to the main backend.
  const sertPaths = ['/api/search', '/api/position', '/api/token', '/api/extra', '/api/transfers', '/api/workflows'];

  return [
    {
      context: pathname => sertPaths.some(p => pathname.startsWith(p)),
      // target: `http${tls ? 's' : ''}://localhost:8081`,
      target: 'https://api.dev.platform.pagopa.it/smo/cruscotto-sert/v1',
      secure: false,
      changeOrigin: true,
    },
    {
      context: serverResources,
      // target: `http${tls ? 's' : ''}://localhost:8080`,
      target: 'https://api.dev.platform.pagopa.it/smo/cruscotto/v1',
      secure: false,
      changeOrigin: true,
    },
  ];
}

module.exports = setupProxy;
