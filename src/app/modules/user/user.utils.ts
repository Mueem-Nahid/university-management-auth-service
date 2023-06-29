import { UserService } from './user.service';
import { IAcademicSemester } from '../academicSemester/academicSemester.interface';

export const generateUserId = async (role: string): Promise<string> => {
  const currentId: string = (await UserService.findLastUserId(role)) || '0';
  return (parseInt(currentId) + 1).toString().padStart(2, '0');
};

export const generateStudentId = async (
  academicSemester: IAcademicSemester
): Promise<string> => {
  let incrementedId: string = await generateUserId('student');
  incrementedId = `${academicSemester.year}-${academicSemester.code}-${incrementedId}`;
  return incrementedId;
};

export const generateAdminOrFacultyId = async (
  userType: 'F' | 'A',
  role: 'faculty' | 'admin'
): Promise<string> => {
  let incrementedId: string = await generateUserId(role);
  incrementedId = `${userType}-${incrementedId}`;
  return incrementedId;
};
