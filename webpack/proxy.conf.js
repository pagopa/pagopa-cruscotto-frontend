function setupProxy({ tls }) {
  const serverResources = ['/api', '/services', '/management', '/v3/api-docs', '/h2-console', '/health'];

  // Sert-specific endpoints — served by cruscotto-sert-backend on port 8081
  // Uses /sert/* prefix locally; pathRewrite strips it before forwarding to the remote /api/* path.
  const sertResources = ['/sert'];

  return [
    {
      context: sertResources,
      // target: `http${tls ? 's' : ''}://localhost:8081`,
      target: 'https://api.dev.platform.pagopa.it/smo/cruscotto-sert-search/v1',
      pathRewrite: { '^/sert': '/api' },
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
