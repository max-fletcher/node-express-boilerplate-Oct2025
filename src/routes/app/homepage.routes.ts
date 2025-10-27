import express from 'express';
import { JwtMiddleware } from '../../middleware/jwt.middleware';
import { viewAppUserHomepage } from '../../controllers/app/homepage.controller';

const AppUserHomePage = express.Router();
const jwtMiddleware = new JwtMiddleware();

// Define Routes
AppUserHomePage.get('/', jwtMiddleware.verifyAppUserToken, viewAppUserHomepage);

export { AppUserHomePage };
