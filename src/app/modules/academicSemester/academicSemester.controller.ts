import { NextFunction, Request, Response } from 'express';
import { AcademicSemesterService } from './academicSemester.service';
import { IAcademicSemester } from './academicSemester.interface';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { IPaginationOptions } from '../../../interfaces/common';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { filterableFields } from './academicSemester.constant';

const createAcademicSemester = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { ...academicSemesterData } = req.body;
    const result: IAcademicSemester =
      await AcademicSemesterService.createSemester(academicSemesterData);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Academic semester created successfully !',
      data: result,
    });
    next();
  }
);

const getAllSemesters = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const filters = pick(req.query, filterableFields);
    const paginationOptions: IPaginationOptions = pick(
      req.query,
      paginationFields
    );

    const result = await AcademicSemesterService.getAllSemesters(
      filters,
      paginationOptions
    );

    sendResponse<IAcademicSemester[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic semesters retrieved successfully !',
      meta: result.meta,
      data: result.data,
    });
    next();
  }
);

const getSingleSemester = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await AcademicSemesterService.getSingleSemester(id);
    sendResponse<IAcademicSemester>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Ok',
      data: result,
    });
    next();
  }
);

export const AcademicSemesterController = {
  createAcademicSemester,
  getAllSemesters,
  getSingleSemester,
};
