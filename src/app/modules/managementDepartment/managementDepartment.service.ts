import { SortOrder } from 'mongoose';
import { managementDepartmentSearchableFields } from './managementDepartment.constant';
import {
  IManagementDepartment,
  IManagementDepartmentFilters,
} from './managementDepartment.inerface';
import { ManagementDepartment } from './managementDepartment.model';
import {
  IGenericResponsePagination,
  IPaginationOptions,
} from '../../../interfaces/common';
import { paginationHelper } from '../../../helpers/paginationHelper';

const createDepartment = async (
  payload: IManagementDepartment
): Promise<IManagementDepartment | null> => {
  return await ManagementDepartment.create(payload);
};

const getAllDepartments = async (
  filters: IManagementDepartmentFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponsePagination<IManagementDepartment[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: managementDepartmentSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
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

  const result = await ManagementDepartment.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total: number = await ManagementDepartment.countDocuments(
    whereConditions
  );

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleDepartment = async (
  id: string
): Promise<IManagementDepartment | null> => {
  return ManagementDepartment.findById(id);
};

const updateDepartment = async (
  id: string,
  payload: Partial<IManagementDepartment>
): Promise<IManagementDepartment | null> => {
  return ManagementDepartment.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
};

const deleteDepartment = async (
  id: string
): Promise<IManagementDepartment | null> => {
  return ManagementDepartment.findByIdAndDelete(id);
};

export const ManagementDepartmentService = {
  createDepartment,
  getAllDepartments,
  getSingleDepartment,
  updateDepartment,
  deleteDepartment,
};
