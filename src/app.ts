import 'dotenv/config'; 
import cors from 'cors';
import express from 'express';
import expressListRoutes from 'express-list-routes';
import helmet from 'helmet';
import path from 'path';
import { corsOptions } from './config/cors.config';
import { globalLimiterOptions } from './config/globalRateLimiter.config';
import { JwtMiddleware } from './middleware/jwt.middleware';
import { testRouter } from './routes/test.routes';
// import { AppUserRouter } from './routes/admin/app-user.routes';
// import { AdminAuthRouter } from './routes/admin/auth.routes';
// import { AdminUserRouter } from './routes/admin/admin-user.routes';
// import { AppAuthRouter } from './routes/app/auth.routes';
import { AppUserRouter } from './routes/app/app-user.routes';
// import { AppUserHomePage } from './routes/app/homepage.routes';
import { getEnvVar } from './utils/common.utils';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

  const queryClient = postgres(getEnvVar('DATABASE_URL'));
  export const db = drizzle(queryClient);

const server = () => {
  try {
    const app = express();
    const PORT = process.env.PORT || 5000;

    // parse application/x-www-form-urlencoded
    app.use(express.urlencoded({ extended: true }));

    // parse application/json
    app.use(express.json());

    // CORS protection
    app.use(cors(corsOptions));

    // For security purposes
    app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

    // serve static files
    const staticFileMode = getEnvVar('APP_STATIC_FILE_MODE')
    if(staticFileMode !== 'local')
      app.use('/', express.static(path.join(__dirname, '/../src/public')));
    else
      app.use('/', express.static(path.join(__dirname, '/public')));

    //rate limiter
    app.use(globalLimiterOptions);
    app.set('trust proxy', 1)

    const jwtMiddleware = new JwtMiddleware();
    // ROUTES
    // test router. for development purposes only
    app.use('/api/v1/test', testRouter);
    // admin routes
    // app.use('/api/v1/admin/auth', AdminAuthRouter);
    // app.use('/api/v1/admin/admin-users', AdminUserRouter);
    // app.use('/api/v1/admin/app-users', jwtMiddleware.verifyToken, AppUserRouter);

    // // app routes
    // app.use('/api/v1/app/auth', AppAuthRouter);
    // app.use('/api/v1/app/homepage', AppUserHomePage);
    // app.use('/api/v1/app/user', AppUserProfileRouter);
    app.use('/api/v1/app/users', AppUserRouter);

    app.all('*', (req, res) => {
      res.status(404);
      if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
      } else if (req.accepts('application/json')) {
        res.json({ error: 'Route Not Found' });
      } else {
        res.type('txt').send('Route Not Found.');
      }
    });

    // List down all routes in the terminal on startup
    expressListRoutes(app, { prefix: 'http://localhost:5000/' });

    app.listen(PORT, () => {
      console.log(`Worker ${process.pid} started on port ${PORT}`);
    });
  } catch (error) {
    if (process.env.APP_ENV === 'local') 
      console.log('Error', error);
  }
};

server();