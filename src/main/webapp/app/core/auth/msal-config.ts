import { MsalGuardConfiguration, MsalInterceptorConfiguration } from '@azure/msal-angular';
import { BrowserCacheLocation, InteractionType, IPublicClientApplication, LogLevel, PublicClientApplication } from '@azure/msal-browser';
import { environment } from 'environments/environment';

/**
 * MSAL instance factory — creates the PublicClientApplication
 * used to interact with Microsoft Entra ID.
 */
export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.msalConfig.auth.clientId,
      authority: environment.msalConfig.auth.authority,
      redirectUri: environment.msalConfig.auth.redirectUri,
      postLogoutRedirectUri: environment.msalConfig.auth.postLogoutRedirectUri,
      navigateToLoginRequestUrl: true,
    },
    cache: {
      cacheLocation: BrowserCacheLocation.SessionStorage,
      storeAuthStateInCookie: false,
    },
    system: {
      loggerOptions: {
        loggerCallback: (level: LogLevel, message: string, containsPii: boolean) => {
          if (containsPii) {
            return;
          }
          switch (level) {
            case LogLevel.Error:
              console.error(message);
              break;
            case LogLevel.Info:
              if (environment.DEBUG_INFO_ENABLED) {
                console.info(message);
              }
              break;
            case LogLevel.Verbose:
              if (environment.DEBUG_INFO_ENABLED) {
                console.debug(message);
              }
              break;
            case LogLevel.Warning:
              console.warn(message);
              break;
          }
        },
        logLevel: environment.DEBUG_INFO_ENABLED ? LogLevel.Verbose : LogLevel.Error,
        piiLoggingEnabled: false,
      },
    },
  });
}

/**
 * MSAL Guard configuration — controls how guard-triggered
 * authentication behaves.
 */
export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: environment.msalConfig.apiScopes,
    },
  };
}

/**
 * MSAL Interceptor configuration — defines which API endpoints
 * need an Entra ID access token and which scopes to request.
 */
export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();

  // Protect backend API calls that go through the proxy
  protectedResourceMap.set('/api/*', environment.msalConfig.apiScopes);
  protectedResourceMap.set('/services/*', environment.msalConfig.apiScopes);
  protectedResourceMap.set('/management/*', environment.msalConfig.apiScopes);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}
