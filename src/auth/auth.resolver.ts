import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserModel } from 'src/user/models/user.model';
import { AuthService } from './auth.service';
import { RegisterInput } from './dtos/register.input';

@Resolver((of) => UserModel)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => UserModel)
  public async register(@Args('input') input: RegisterInput) {
    return this.authService.register(input);
  }
}
