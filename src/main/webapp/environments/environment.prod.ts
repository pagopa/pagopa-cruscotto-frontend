export const environment = {
  DEBUG_INFO_ENABLED: false,
  msalConfig: {
    auth: {
      clientId: 'TODO_PROD_CLIENT_ID',
      authority: 'https://login.microsoftonline.com/TODO_PROD_TENANT_ID',
      redirectUri: window.location.origin,
      postLogoutRedirectUri: window.location.origin,
    },
    apiScopes: ['api://pagopa-p-crusc8-ui/user_impersonation'],
  },
};
