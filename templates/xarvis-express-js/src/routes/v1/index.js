const express = require('express');
const healthRoute = require('./health.route');

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

module.exports = router;
