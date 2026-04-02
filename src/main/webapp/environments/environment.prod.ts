export const environment = {
  DEBUG_INFO_ENABLED: false,
  TEST_ENVIRONMENT: false,
  msalConfig: {
    auth: {
      clientId: '5a3a6ad5-b4bc-49aa-a111-23279a0256ed',
      authority: 'https://login.microsoftonline.com/7788edaf-0346-4068-9d79-c868aed15b3d',
      redirectUri: 'https://crusc8.platform.pagopa.it/',
      postLogoutRedirectUri: 'https://crusc8.platform.pagopa.it',
    },
    apiScopes: ['api://pagopa-p-crusc8-ui/user_impersonation'],
  },
};
