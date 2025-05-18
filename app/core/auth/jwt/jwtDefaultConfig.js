const jwtDefaultConfig = {
  loginEndpoint: '/jwt/login',
  registerEndpoint: '/jwt/register',
  refreshEndpoint: '/jwt/refresh-token',
  logoutEndpoint: '/jwt/logout',

  // Esto tendrá el prefijo token en el encabezado de autorización
  // Ejemplo: Autorización: Bearer <token>
  tokenType: 'Bearer',

  // El valor de esta propiedad se utilizará como clave para almacenar el token JWT en el almacenamiento.
  storageTokenKeyName: 'accessToken',
  storageRefreshTokenKeyName: 'refreshToken'
}

export default jwtDefaultConfig;