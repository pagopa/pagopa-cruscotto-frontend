export const environment = {
  DEBUG_INFO_ENABLED: true,
  msalConfig: {
    auth: {
      clientId: '10eb962e-531c-4f0c-b216-bb0539bba43b',
      authority: 'https://login.microsoftonline.com/7788edaf-0346-4068-9d79-c868aed15b3d',
      redirectUri: window.location.origin,
      postLogoutRedirectUri: window.location.origin,
    },
    apiScopes: ['api://pagopa-d-crusc8-ui/user_impersonation'],
  },
};
