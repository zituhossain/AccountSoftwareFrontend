export default {
  meEndpoint: 'http://localhost:1337/api/users/me',
  loginEndpoint: 'http://localhost:1337/api/auth/local',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'logout' // logout | refreshToken
}
