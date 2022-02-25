import { Injectable } from '@nestjs/common';
import { ForbiddenError } from 'apollo-server-express';
import { Roles } from 'src/user/schema/user.schema';
import { UserService } from 'src/user/user.service';
import { RegisterInput } from './dtos/register.input';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  public async register(registerInput: RegisterInput) {
    const { email, username } = registerInput;
    const curUserByEmail = await this.userService.findOneByEmail(email);
    const curUserByUserName = await this.userService.findOneByUsername(
      username,
    );

    if (curUserByEmail) {
      throw new ForbiddenError('Email has already been used.')
    } else if (curUserByUserName) {
      throw new ForbiddenError('UserName has already been used')
    } else {
      const count = await this.userService.getUserCount()
      const params = count === 0 ? { ...registerInput, role: Roles.SUPERUSER } : registerInput
      const res = await this.userService.create({ ...params })

      //TODO: return generate JWT
      console.log(res)
      return res
    }


  }
}
