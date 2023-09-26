import express from 'express';
import healthRoute from './health.route';

const router = express.Router();

const appRoutes = [
  {
    path: '/',
    route: healthRoute,
  },
];

appRoutes.forEach((appRoute) => {
  router.use(appRoute.path, appRoute.route);
});

export default router;
