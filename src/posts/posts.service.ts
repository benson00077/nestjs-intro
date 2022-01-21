import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// gql model
import { Post } from './models/post.model';
import { Posts } from './models/posts.model';
// type
import { Model } from 'mongoose';
import { PostDocument } from './schemas/posts.schema';
import { CreatePostInput } from './dtos/create-post.input';
import { PaginationInput } from './dtos/pagination.input';
import { ForbiddenError } from 'apollo-server-errors';
import { UpdatePostInput } from './dtos/update-post.input';
import { Tags } from './models/tags.model';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel('Post')
    private readonly postModel: Model<PostDocument>,
  ) {}

  private async getTatalCount(): Promise<number> {
    return this.postModel.countDocuments();
  }

  public async findPublicByPagination(input: PaginationInput): Promise<Posts> {
    const { page, pageSize, title, tag } = input;

    const params = {
      title: { $regex: !title ? '' : title, $options: 'i' },
      isPublic: { $ne: false },
    };
    const _params = tag ? { ...params, tags: tag } : params;

    const total = await this.postModel.find(_params).count();
    const items = await this.postModel
      .find(_params)
      .sort({ createdAt: -1 }) // descending sort
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return {
      total,
      page,
      pageSize,
      items,
    };
  }

  public async findByPagination(input: PaginationInput): Promise<Posts> {
    const { page, pageSize, title } = input;

    const total = await this.getTatalCount();
    const items = await this.postModel
      .find({ title: { $regex: !title ? '' : title, $options: 'i' } })
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return {
      total,
      page,
      pageSize,
      items,
    };
  }

  public async findOneById(id: string): Promise<Post> {
    const curr = await this.postModel.findById(id);
    if (!curr || curr.isPublic === false) {
      throw new ForbiddenError('Post not found');
    }

    const prev = await this.postModel
      .find({ createdAt: { $lt: curr.createdAt }, isPublic: { $ne: false } })
      .sort({ createAt: -1 })
      .limit(1);

    const next = await this.postModel
      .find({ createAt: { $gt: curr.createdAt }, isPublic: { $ne: false } })
      .sort({ createAt: -1 })
      .limit(1);

    const post = {
      ...curr.toObject(),
      prev: prev[0] ? prev[0] : null,
      next: next[0] ? next[0] : null,
    };
    return post;
  }

  public async create(postInput: CreatePostInput): Promise<Post> {
    return this.postModel.create(postInput);
  }

  public async update(postInput: UpdatePostInput): Promise<Post> {
    const { id, ...rest } = postInput;
    return this.postModel.findByIdAndUpdate(id, rest, { new: true });
  }

  public async delteOneById(id: string): Promise<Post> {
    return this.postModel.findByIdAndDelete(id);
  }

  public async batchDelte(ids: string[]) {
    //TODO
  }

  public async updatePV(id: string): Promise<Post> {
    const { pv } = await this.findOneById(id);
    return this.postModel.findByIdAndUpdate(id, { pv: pv + 1 }, { new: true });
  }

  public async updateLike(id: string): Promise<Post> {
    const { like } = await this.findOneById(id);
    return this.postModel.findByIdAndUpdate(
      id,
      { like: like + 1 },
      { new: true },
    );
  }

  public async getTopPVPosts(limit: number): Promise<Post[]> {
    return this.postModel
      .find({ isPublic: { $ne: false } })
      .sort({ pv: -1, _id: -1 })
      .limit(limit);
  }

  public async getTopLikePosts(limit: number): Promise<Post[]> {
    return this.postModel
      .find({ isPublic: { $ne: false } })
      .sort({ like: -1, _id: -1 })
      .limit(limit);
  }

  public async getAllTags(): Promise<Tags> {
    const posts = await this.postModel.find(
      { isPublic: { $ne: false } },
      { tags: 1 },
    );
    const arr = []
    posts.forEach(post => arr.push(...post.tags))

    return {
      tags: [...new Set(arr)]
    }
  }

  public async archive() {
    //TODO
  }

}
