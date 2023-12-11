export default {
  meEndpoint: 'http://tenantb.localhost:5259/api/Auth/me',
  loginEndpoint: 'http://tenantb.localhost:5259/api/Auth/login',
  registerEndpoint: '/jwt/register',
  apiEndpoint: 'http://tenantb.localhost:5259/api',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
