
import cors from 'cors';
import express from 'express';
import expressListRoutes from 'express-list-routes';
import helmet from 'helmet';
import path from 'path';
import { corsOptions } from './config/cors.config';
import { globalLimiterOptions } from './config/globalRateLimiter.config';
import { JwtMiddleware } from './middleware/jwt.middleware';
import { AppUserRouter } from './routes/admin/app-user.routes';
import { testRouter } from './routes/test.routes';
import { AdminAuthRouter } from './routes/admin/auth.routes';
import { CourseRouter } from './routes/admin/course.routes';
import { DayRouter } from './routes/admin/day.routes';
import { LessonRouter } from './routes/admin/lesson.routes';
import { FlashCardRouter } from './routes/admin/flash-card.routes';
import { AdminUserRouter } from './routes/admin/admin-user.routes';
import { AppAuthRouter } from './routes/app/auth.routes';
import { AppUserProfileRouter } from './routes/app/app-user.routes';
import { AppCourseRouter } from './routes/app/course.routes';
import { AppLessonRouter } from './routes/app/lesson.routes';
import { AppUserStatisticsRouter } from './routes/app/statistics.routes';
import { AppUserHomePage } from './routes/app/homepage.routes';
import { LanguageRouter } from './routes/admin/language.routes';
import { getEnvVar } from './utils/common.utils';

// const numCPUs = os.cpus().length

const server = () => {
  try {
    const app = express();
    // const server = http.createServer(app);
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
    if(staticFileMode === 'production')
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
    app.use('/api/v1/admin/auth', AdminAuthRouter);
    app.use('/api/v1/admin/languages', jwtMiddleware.verifyToken, LanguageRouter);
    app.use('/api/v1/admin/admin-users', AdminUserRouter);
    app.use('/api/v1/admin/app-users', jwtMiddleware.verifyToken, AppUserRouter);
    app.use('/api/v1/admin/courses', jwtMiddleware.verifyToken, CourseRouter);
    app.use('/api/v1/admin/days', jwtMiddleware.verifyToken, DayRouter);
    app.use('/api/v1/admin/lessons', jwtMiddleware.verifyToken, LessonRouter);
    app.use('/api/v1/admin/flash-cards', jwtMiddleware.verifyToken, FlashCardRouter);

    // // app routes
    app.use('/api/v1/app/auth', AppAuthRouter);
    app.use('/api/v1/app/homepage', AppUserHomePage);
    app.use('/api/v1/app/user', AppUserProfileRouter);
    app.use('/api/v1/app/course', AppCourseRouter);
    app.use('/api/v1/app/lesson', AppLessonRouter);
    app.use('/api/v1/app/statistics', AppUserStatisticsRouter);

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
    console.log('Error', error);
  }
  // }
};

server();
