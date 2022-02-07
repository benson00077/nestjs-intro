import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// gql model
import { PostStatisticsModel } from './models/post-statistics.model';
// type
import { Model } from 'mongoose';
import { CreatePostStatisticsInput } from './dtos/create-post-statistics.input';
import { PostStatisticsDocument } from './schemas/post-statistics.schema';

@Injectable()
export class PostStatisticsService {
  constructor(
    @InjectModel('PostStatistics')
    private readonly postStatisticsModel: Model<PostStatisticsDocument>,
  ) {}

  public async findAll() {
    const res = await this.postStatisticsModel
      .aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
            items: {
              $push: {
                postId: '$postId',
                postName: '$postName',
                scenes: '$scenes',
                operatedAt: '$createdAt',
              },
            },
          },
        },
      ])
      .sort({ _id: -1 });

    return res;
  }

  public async create(
    input: CreatePostStatisticsInput,
  ): Promise<PostStatisticsModel> {
    return this.postStatisticsModel.create(input);
  }
}
