import { Field, ObjectType, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class Post {
  @Field(() => ID)
  readonly _id: string;

  @Field()
  readonly posterUrl: string;

  @Field()
  readonly title: string;

  @Field()
  readonly summary: string;

  @Field()
  readonly content: string;

  @Field(() => [String])
  readonly tags: string[];

  @Field()
  readonly lastModifiedDate: Date;

  @Field(() => Int)
  readonly like: number;

  @Field(() => Int)
  readonly pv: number;

  @Field()
  readonly isPublic: boolean;

  @Field()
  readonly createdAt: Date;

  @Field()
  readonly updatedAt: Date;

  @Field(() => Post, { nullable: true })
  readonly prev: Post | null;

  @Field(() => Post, { nullable: true })
  readonly next: Post | null;
}
