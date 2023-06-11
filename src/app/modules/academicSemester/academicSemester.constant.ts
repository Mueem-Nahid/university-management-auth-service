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

export const academicSemesterTitleCodeMapper: { [key: string]: string } = {
  Spring: '01',
  Summer: '02',
  Fall: '03',
};
