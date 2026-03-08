import { Router } from 'express';
import { gamesRouter } from './games.routes';
import { healthRouter } from './health.routes';

const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use(gamesRouter);

export { apiRouter };
