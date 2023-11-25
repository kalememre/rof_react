export default {
  meEndpoint: 'http://abc.localhost:8000/api/me/',
  loginEndpoint: 'http://abc.localhost:8000/api/token/',
  registerEndpoint: '/jwt/register',
  apiEndpoint: 'http://abc.localhost:8000/api/',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
