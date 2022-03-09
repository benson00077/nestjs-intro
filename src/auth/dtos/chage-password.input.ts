import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ChangePasswordInput {
  @Field()
  public readonly oldPassword: string;

  @Field()
  public readonly newPassword: string;
}
