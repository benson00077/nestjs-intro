import * as mongoose from 'mongoose';
import { encryptPassword, validatePassword } from 'src/shared/utils';
import { v4 } from 'uuid';

export enum Roles {
  SUPERUSER = 0b0000000000000,
  ADMIN = 0b0000000000001,
  USER = 0b0000000000010,
  NOT_CERTIFIED = 0b0000000000100,
}

export interface UserDocument extends mongoose.Document {
  readonly _id: string;
  readonly username: string;
  readonly email: string;
  password: string;
  readonly role: Roles;
  createdAt: Date
  updatedAt: Date
  isValidPassword(password: string, hasehdPassword: string): boolean;
}

export const UserSchema = new mongoose.Schema(
  {
    _id: { type: String, default: v4 },
    email: { type: String, required: true },
    username: { default: '', type: String, required: true },
    password: { type: String, required: true },
    role: { default: Roles.NOT_CERTIFIED, type: Number, required: true },
  },
  {
    collection: 'user',
    timestamps: true,
  },
);

UserSchema.pre<UserDocument>('save', function (next) {
  this.password = encryptPassword(this.password);
  next();
});

// assign a function to the "methods" object of our UserSchema
// NOTICE: isValidPassword is not defined in user.service.ts, which is for communication w/ db. 
UserSchema.methods.isValidPassword = function (
  password: string,
  hasehdPassword: string,
) {
  // this.password === hashedPassword
  return validatePassword(password, hasehdPassword);
};
