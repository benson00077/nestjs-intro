import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserModel } from 'src/user/models/user.model';
import { AuthService } from './auth.service';
import { LoginInput } from './dtos/login.input';
import { RegisterInput } from './dtos/register.input';

@Resolver((of) => UserModel)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => UserModel)
  public async login(@Args('input') input: LoginInput) {
    return this.authService.login(input)
  }

  @Mutation(() => UserModel)
  public async register(@Args('input') input: RegisterInput) {
    return this.authService.register(input)
  }
}