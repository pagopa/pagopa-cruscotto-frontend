export const environment = {
  DEBUG_INFO_ENABLED: false,
  msalConfig: {
    auth: {
      clientId: '4ee1f987-9c92-4ad1-be17-df749dbba610',
      authority: 'https://login.microsoftonline.com/7788edaf-0346-4068-9d79-c868aed15b3d',
      redirectUri: 'https://crusc8.uat.platform.pagopa.it/',
      postLogoutRedirectUri: 'https://crusc8.uat.platform.pagopa.it',
    },
    apiScopes: ['api://pagopa-u-crusc8-ui/user_impersonation'],
  },
};
