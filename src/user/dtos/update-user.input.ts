import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  public readonly id?: string;

  @Field({ nullable: true })
  public readonly password?: string;
}
