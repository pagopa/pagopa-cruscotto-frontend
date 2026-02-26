export const environment = {
  DEBUG_INFO_ENABLED: true,
  msalConfig: {
    auth: {
      clientId: '10eb962e-531c-4f0c-b216-bb0539bba43b',
      authority: 'https://login.microsoftonline.com/7788edaf-0346-4068-9d79-c868aed15b3d',
      redirectUri: 'http://localhost:4200',
      postLogoutRedirectUri: 'http://localhost:4200',
    },
    apiScopes: ['api://10eb962e-531c-4f0c-b216-bb0539bba43b/access_as_user'],
  },
};
