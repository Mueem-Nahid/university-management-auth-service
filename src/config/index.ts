import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  default_admin_pass: process.env.DEFAULT_ADMIN_PASSWORD,
  default_faculty_pass: process.env.DEFAULT_FACULTY_PASSWORD,
  default_student_password: process.env.DEFAULT_STUDENT_PASSWORD,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
};
