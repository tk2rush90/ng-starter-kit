export const environment = {
  // WebView 감지하기 위한 앱 이름
  appName: 'AppName',
  google: {
    clientId: '',
    redirectUri: '',
    appRedirectUri: '',
  },
  kakao: {
    clientId: '',
    redirectUri: '',
    appRedirectUri: '',
  },
  host: {
    frontend: 'http://localhost:4200',
    backend: 'http://localhost:3000',
    googleOauth2: 'https://accounts.google.com/o/oauth2/v2/auth',
    kakaoOauth2: 'https://kauth.kakao.com/oauth/authorize',
  },
};
