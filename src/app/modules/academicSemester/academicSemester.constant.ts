import {
  IAcademicSemesterCode,
  IAcademicSemesterTitle,
  IMonth,
} from './academicSemester.interface';

export const months: IMonth[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const academicSemesterTitle: IAcademicSemesterTitle[] = [
  'Spring',
  'Summer',
  'Fall',
];

export const academicSemesterCode: IAcademicSemesterCode[] = ['01', '02', '03'];
