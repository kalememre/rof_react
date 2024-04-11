export default {
  meEndpoint: 'https://rofnet.azurewebsites.net/api/Auth/me',
  loginEndpoint: 'https://rofnet.azurewebsites.net/api/Auth/login',
  registerEndpoint: '/jwt/register',
  apiEndpoint: 'https://rofnet.azurewebsites.net/api',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}

