export default {
  meEndpoint: 'http://clayton.localhost:8000/api/me/',
  loginEndpoint: 'http://clayton.localhost:8000/api/token/',
  registerEndpoint: '/jwt/register',
  apiEndpoint: 'http://clayton.localhost:8000/api/',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
