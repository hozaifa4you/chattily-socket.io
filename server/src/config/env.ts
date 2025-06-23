const app_name = process.env.APP_NAME ?? 'Chattily';
const port = process.env.PORT || 3030;
const frontend_url = process.env.FRONTEND_URL || 'http://localhost:3000';
const node_env = process.env.NODE_ENV ?? 'development';
const db_url = process.env.DATABASE_URL ?? '';
const jwt_secret = process.env.JWT_SECRET ?? '';
const jwt_expires_in = process.env.JWT_EXPIRES_IN ?? '1h';

export {
   port,
   frontend_url,
   node_env,
   db_url,
   app_name,
   jwt_secret,
   jwt_expires_in,
};
