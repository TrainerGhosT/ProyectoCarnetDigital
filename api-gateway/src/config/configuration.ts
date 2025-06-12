export default () => ({
  port: parseInt(process.env.API_GATEWAY_PORT, 10) || 3000,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '5m',
  },
  services: {
    auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    user: process.env.USER_SERVICE_URL || 'http://localhost:3003',
    catalog: process.env.CATALOG_SERVICE_URL || 'http://localhost:3002',
  },
});