import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import { encryptPassword } from 'src/shared/utils';
import { Roles, UserDocument } from 'src/user/schema/user.schema';
import { UserService } from 'src/user/user.service';
import { ChangePasswordInput } from './dtos/chage-password.input';
import { LoginInput } from './dtos/login.input';
import { RegisterInput } from './dtos/register.input';
import { IPayload } from './interfaces/jwt.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private generateJWT(email: string, res: UserDocument) {
    const { password, ...rest } = res.toObject();
    const payload = { email, sub: res._id };
    return {
      access_token: this.jwtService.sign(payload), // NOTICE: GQL not have this Field
      password: 'NOTICE: GQL have this Filed but I filter it out.',
      ...rest,
    };
  }

  private async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);

    if (user && user.isValidPassword(password, user.password)) {
      return user;
    }

    throw new AuthenticationError(
      'Inlavid username or password. Please try again.',
    );
  }

  public async login(loginInput: LoginInput) {
    const { email, password } = loginInput;
    const res = await this.validateUser(email, password);
    return this.generateJWT(email, res);
  }

  public async register(registerInput: RegisterInput) {
    const { email, username } = registerInput;
    const curUserByEmail = await this.userService.findOneByEmail(email);
    const curUserByUserName = await this.userService.findOneByUsername(
      username,
    );

    if (curUserByEmail) {
      throw new ForbiddenError('Email has already been used.');
    } else if (curUserByUserName) {
      throw new ForbiddenError('UserName has already been used');
    } else {
      const count = await this.userService.getUserCount();
      const params =
        count === 0
          ? { ...registerInput, role: Roles.SUPERUSER }
          : registerInput;
      const res = await this.userService.create({ ...params });

      //TODO: return generate JWT
      return res;
    }
  }

  public async changePassword(input: ChangePasswordInput, token: string) {
    const { oldPassword, newPassword } = input;

    // from "Bearer <encodedJWT>" to "<encodedJWT>"
    const jwtParser = (token: string) => token.slice(7);
    const EncodedJWT = jwtParser(token);

    const { email, sub: userId } = this.jwtService.decode(
      EncodedJWT,
    ) as IPayload;
    const user = await this.userService.findOneByEmail(email);

    if (user && user.isValidPassword(oldPassword, user.password)) {
      const res = await this.userService.updateUser({
        id: userId,
        password: encryptPassword(newPassword),
      });
      const { password, ...rest } = res.toObject();

      return {
        password: 'NOTICE: GQL have this Filed but I filter it out.',
        access_token: 'NOTICE: GQL have this Filed but I filter it out.',
        ...rest,
      };
    }

    throw new ForbiddenError('Wrong password !');
  }
}
