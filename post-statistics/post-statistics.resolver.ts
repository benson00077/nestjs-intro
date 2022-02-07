import { Query, Args, Mutation, Resolver } from '@nestjs/graphql';
import {
  PostStatisticsGroupModel,
  PostStatisticsModel,
} from './models/post-statistics.model';
import { PostStatisticsService } from './post-statistics.service';
// type
import { CreatePostStatisticsInput } from './dtos/create-post-statistics.input';

@Resolver()
export class PostStatisticsResolver {
  constructor(private readonly postStatisticService: PostStatisticsService) {}

  @Query(() => [PostStatisticsGroupModel])
  public async getPostStatistics(): Promise<PostStatisticsGroupModel[]> {
    return this.postStatisticService.findAll();
  }

  @Mutation(() => PostStatisticsModel)
  public async createPostStatistics(
    @Args('input') input: CreatePostStatisticsInput,
  ): Promise<PostStatisticsModel> {
    return this.postStatisticService.create(input);
  }
}
