import express from 'express';
import { JwtMiddleware } from '../../middleware/jwt.middleware';
import { viewAppUserStatistics } from '../../controllers/app/statistics.controller';

const AppUserStatisticsRouter = express.Router();
const jwtMiddleware = new JwtMiddleware();

// Define Routes
AppUserStatisticsRouter.get('/', jwtMiddleware.verifyAppUserToken, viewAppUserStatistics);

export { AppUserStatisticsRouter };
