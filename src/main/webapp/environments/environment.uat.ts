export const environment = {
  DEBUG_INFO_ENABLED: false,
  msalConfig: {
    auth: {
      clientId: 'TODO_UAT_CLIENT_ID',
      authority: 'https://login.microsoftonline.com/TODO_UAT_TENANT_ID',
      redirectUri: window.location.origin,
      postLogoutRedirectUri: window.location.origin,
    },
    apiScopes: ['api://pagopa-u-crusc8-ui/user_impersonation'],
  },
};
