import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/shared/guard/GraphQLAuth.guard';
import { UserModel } from 'src/user/models/user.model';
import { AuthService } from './auth.service';
import { ChangePasswordInput } from './dtos/chage-password.input';
import { LoginInput } from './dtos/login.input';
import { RegisterInput } from './dtos/register.input';
import { Request } from 'express';
import { ReqDecorator } from 'src/shared/decorators/req.decorator';

@Resolver(() => UserModel)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => UserModel)
  public async login(@Args('input') input: LoginInput) {
    return this.authService.login(input);
  }

  @Mutation(() => UserModel)
  public async register(@Args('input') input: RegisterInput) {
    return this.authService.register(input);
  }

  @Mutation(() => UserModel)
  @UseGuards(JwtAuthGuard)
  public async changePassword(
    @Args('input') input: ChangePasswordInput,
    @ReqDecorator() req: Request,
  ) {
    return this.authService.changePassword(input, req.headers.authorization);
  }
}
