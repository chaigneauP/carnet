import express from 'express';
import { apiRouter } from './routes';
import { errorHandler, notFoundHandler } from './middleware/error-handler';

const app = express();

app.use(express.json());

app.get('/', (_request, response) => {
  response.json({
    name: 'carnet-backend',
    status: 'ok',
    docs: ['/api/health', '/api/games'],
  });
});

app.use('/api', apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
