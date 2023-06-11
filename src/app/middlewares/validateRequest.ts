import { AnyZodObject } from 'zod';
import { NextFunction, Request, Response } from 'express';

const validateRequest =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log('here: ', req.body);
      console.log('schema: ', schema);
      const data = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      });
      console.log('Data: ', data);
      return next();
    } catch (error) {
      next(error);
    }
  };

export default validateRequest;
