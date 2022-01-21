import { Resolver, Query, Args, Mutation, ID, Int } from '@nestjs/graphql';
import { PostsService } from './posts.service';
// gql model
import { Post } from './models/post.model';
import { Posts } from './models/posts.model';
// type
import { CreatePostInput } from './dtos/create-post.input';
import { PaginationInput } from './dtos/pagination.input';
import { UpdatePostInput } from './dtos/update-post.input';
import { Tags } from './models/tags.model';

@Resolver(of => Post)
export class PostsResolver {

  constructor(private postsService: PostsService) {}

  @Query(() => Posts) 
  public async posts(@Args('input') input: PaginationInput) {
    return this.postsService.findPublicByPagination(input)
  }

  @Query(() => Posts)
  public async getPosts(@Args('input') input: PaginationInput) {
    return this.postsService.findByPagination(input)
  }

  @Query(() => Post)
  public async getPostById(@Args({ name: 'id', type: () => ID}) id: string) {
    return this.postsService.findOneById(id)
  }

  @Mutation(returns => Post)
  public async createPost(@Args('input') input: CreatePostInput)  {
    return this.postsService.create(input)
  }

  // TODO: Handle exception while wrong id input
  @Mutation(returns => Post) 
  public async updatePostById(@Args('input') input: UpdatePostInput) {
    return this.postsService.update(input)
  }

  @Mutation(() => Post) 
  public async deletePostById(@Args({name: 'id', type: () => ID}) id: string) {
    return this.postsService.delteOneById(id)
  }

  @Mutation(() => Post)
  public async deletePosts() {
    // TODO: batch delete
  }

  @Mutation(() => Post)
  public async updatePV(@Args({ name: 'id', type: () => ID}) id: string) {
    return this.postsService.updatePV(id)
  }

  @Mutation(() => Post)
  public async updateLike(@Args({ name: 'id', type: () => ID}) id: string) {
    return this.postsService.updateLike(id)
  }

  @Mutation(() => Post)
  public async getTopPVPosts(@Args({ name: 'limit', type: () => Int}) limit: number) {
    return this.postsService.getTopPVPosts(limit)
  }

  @Mutation(() => Post)
  public async getTopLikePosts(@Args({ name: 'limit', type: () => Int}) limit: number) {
    return this.postsService.getTopLikePosts(limit)
  }

  @Query(() => Tags)
  public async getAllTags() {
    return this.postsService.getAllTags()
  }

  // TODO: 
  // @Query()
  // public async archive() {
  // }
}
