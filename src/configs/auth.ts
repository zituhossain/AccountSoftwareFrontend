export default {
  meEndpoint: 'http://localhost:1337/api/users/me',
  loginEndpoint: 'http://localhost:1337/api/auth/local',
  storageTokenKeyName: 'accessToken',
  storageUserKeyName: 'userData',
  onTokenExpiration: 'logout' // logout | refreshToken
}
