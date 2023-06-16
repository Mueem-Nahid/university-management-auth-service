import { IGenericErrorMessage } from './error';
import { SortOrder } from 'mongoose';

export type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
};

export type IPaginationOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
};

export type IGenericResponsePagination<T> = {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: T;
};
