import express, { Application } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import { UerRoutes } from './app/modules/user/user.route';

const app: Application = express();

app.use(cors());

// parse data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// application routes
app.use('/api/v1/user', UerRoutes);

// testing
app.use('/', async () => {
  Promise.reject(new Error('\nUnhandled promise rejection\n'));
});

// global error handler
app.use(globalErrorHandler);

export default app;
