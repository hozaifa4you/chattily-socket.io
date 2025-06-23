import express, { type Router } from 'express';

const profileRoutes: Router = express.Router();

profileRoutes.get('/');

export { profileRoutes };
