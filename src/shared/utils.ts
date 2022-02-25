import * as bcrypt from 'bcrypt';

export const encryptPassword = (password: string) =>
  bcrypt.hashSync(password, 10);

export const validatePassword = (password: string, hashedPassword: string): boolean =>
  bcrypt.compareSync(password, hashedPassword);
