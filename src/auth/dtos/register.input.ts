import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RegisterInput {
  @Field()
  public readonly email: string;

  @Field()
  public readonly username: string;

  @Field()
  public readonly password: string;
}
