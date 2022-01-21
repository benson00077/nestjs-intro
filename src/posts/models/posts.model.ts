import { Field, ObjectType, ID, Int } from '@nestjs/graphql';
import { Post } from './post.model';

@ObjectType()
export class Posts {
  @Field(() => ID)
  public readonly total: number;

  @Field()
  public readonly page: number;

  @Field()
  public readonly pageSize: number;

  @Field(() => [Post])
  public readonly items: Post[];
}
