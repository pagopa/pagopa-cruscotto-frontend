export const environment = {
  DEBUG_INFO_ENABLED: false,
  msalConfig: {
    auth: {
      clientId: '<YOUR_ENTRA_ID_CLIENT_ID>',
      authority: 'https://login.microsoftonline.com/<YOUR_TENANT_ID>',
      redirectUri: 'https://<YOUR_PRODUCTION_DOMAIN>',
      postLogoutRedirectUri: 'https://<YOUR_PRODUCTION_DOMAIN>',
    },
    apiScopes: ['api://<YOUR_ENTRA_ID_CLIENT_ID>/access_as_user'],
  },
};
