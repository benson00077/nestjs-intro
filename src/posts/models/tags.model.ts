import { Field, ObjectType } from "@nestjs/graphql";


@ObjectType()
export class Tags {
  @Field(() => [String])
  public readonly tags: string[]
}