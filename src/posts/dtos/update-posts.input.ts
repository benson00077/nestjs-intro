import { InputType, Field } from '@nestjs/graphql';
import { UpdatePostInput } from './update-post.input';

@InputType()
export class UpdatePostsInput {
  @Field(() => [UpdatePostInput]) // Use an array of UpdatePostInput
  public readonly posts: UpdatePostInput[];
}
