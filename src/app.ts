import express, { Application } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import { UserRoutes } from './app/modules/user/user.route';
import { AcademicSemesterRoutes } from './app/modules/academicSemester/academicSemester.route';

const app: Application = express();

app.use(cors());

// parse data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// application routes
app.use('/api/v1/user', UserRoutes);
app.use('/api/v1/academic-semester', AcademicSemesterRoutes);

// testing
app.use('/', async () => {
  Promise.reject(new Error('\nUnhandled promise rejection\n'));
});

// global error handler
app.use(globalErrorHandler);

export default app;
