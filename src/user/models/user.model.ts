import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserModel {
  @Field(() => ID)
  public readonly _id: string;

  @Field()
  public readonly email: string;

  @Field()
  public readonly username: string;

  @Field()
  public readonly password: string;

  @Field()
  public readonly role: number;

  @Field()
  public readonly createdAt: Date;

  @Field()
  public readonly updatedAt: Date;
}
