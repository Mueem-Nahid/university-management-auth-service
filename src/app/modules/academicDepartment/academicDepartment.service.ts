import { SortOrder } from 'mongoose';
import { paginationHelper } from '../../../helpers/paginationHelper';
import {
  IGenericResponsePagination,
  IPaginationOptions,
} from '../../../interfaces/common';
import { academicDepartmentSearchableFields } from './academicDepartment.constants';
import {
  IAcademicDepartment,
  IAcademicDepartmentFilters,
} from './academicDepartment.interfaces';
import { AcademicDepartment } from './academicDepartment.model';

const getAllDepartments = async (
  filters: IAcademicDepartmentFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponsePagination<IAcademicDepartment[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: academicDepartmentSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $paginationOptions: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await AcademicDepartment.find(whereConditions)
    .populate('academicFaculty')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await AcademicDepartment.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const createDepartment = async (
  payload: IAcademicDepartment
): Promise<IAcademicDepartment | null> => {
  return (await AcademicDepartment.create(payload)).populate('academicFaculty');
};

const getSingleDepartment = async (
  id: string
): Promise<IAcademicDepartment | null> => {
  return AcademicDepartment.findById(id).populate('academicFaculty');
};

const updateDepartment = async (
  id: string,
  payload: Partial<IAcademicDepartment>
): Promise<IAcademicDepartment | null> => {
  return AcademicDepartment.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  }).populate('academicFaculty');
};

const deleteDepartment = async (
  id: string
): Promise<IAcademicDepartment | null> => {
  return AcademicDepartment.findByIdAndDelete(id);
};

export const AcademicDepartmentService = {
  getAllDepartments,
  getSingleDepartment,
  updateDepartment,
  deleteDepartment,
  createDepartment,
};
