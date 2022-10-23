import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Post } from './models/post.model';
import { PostsService } from './posts.service';
import { PostDocument } from './schemas/posts.schema';
import { UpdatePostInput } from './dtos/update-post.input';

/**
 *  Test w/ mongoose example:
 *  https://github.com/jmcdo29/testing-nestjs/blob/main/apps/mongo-sample/src/cat/cat.service.spec.ts
 */

const mockPost = (
  _id = 'dummyId',
  posterUrl = 'example.com',
  title = 'This is a dummy title',
  summary = 'This is a dummy summary',
  content = 'some markdown content',
  tags = ['javascript', 'blog'],
  lastModifiedDate = new Date(),
  like = 999,
  pv = 9999,
  isPublic = true,
  createdAt = new Date(),
  updatedAt = new Date(),
  prev = null,
  next = null,
): Post => ({
  _id,
  posterUrl,
  title,
  summary,
  content,
  tags,
  lastModifiedDate,
  like,
  pv,
  isPublic,
  createdAt,
  updatedAt,
  prev,
  next,
});

const mockPostDoc = (dto?: Partial<Post>): Partial<PostDocument> => ({
  _id: dto?._id || Date.now() + '',
  posterUrl: dto?.posterUrl || 'example.com',
  title: dto?.title || 'This is a dummy title',
  lastModifiedDate: dto?.lastModifiedDate || new Date(2022, 1, 1),
});

const mockPostDocArr = [
  mockPostDoc({ _id: 'uuid1', title: 'title 1' }),
  mockPostDoc({ _id: 'uuid2', title: 'title 2' }),
  mockPostDoc({ _id: 'uuid3', title: 'title 3' }),
];

const mockPostMongooseModel = {
  new: jest.fn().mockResolvedValue(mockPost()),
  constructor: jest.fn().mockResolvedValue(mockPost()),
  create: jest.fn().mockImplementation((dto) => mockPostDoc({ ...dto })),
  findByIdAndUpdate: jest
    .fn()
    .mockImplementation((id: string, rest: Partial<UpdatePostInput>) => {
      const post = mockPostDocArr.filter((p) => p._id === id)[0];
      for (const [key, value] of Object.entries(rest)) {
        if (post[key]) post[key] = value;
      }
      return post;
    }),
  findByIdAndDelete: jest
    .fn()
    .mockImplementation((id: string, rest: Partial<UpdatePostInput>) => {
      let index: number;
      mockPostDocArr.forEach((p, i) => {
        if (p._id === id) index = i;
      });
      const removed = mockPostDocArr.splice(index, 1)[0];
      return removed;
    }),
};

describe('PostsService', () => {
  let service: PostsService;
  let model: Model<PostDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getModelToken('Post'),
          useValue: mockPostMongooseModel,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    model = module.get<Model<PostDocument>>(getModelToken('Post'));

    jest
      .spyOn(service, 'findOneById')
      .mockImplementation(
        (id: string) =>
          Promise.resolve(mockPostDocArr.filter((p) => p._id === id)[0]) as any,
      );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('spy on findOneById()', async () => {
    const data = await service.findOneById('uuid1');
    expect(data).toEqual(mockPostDocArr[0]);
  });

  describe('should create one, update one, and delete one', () => {
    let postId = '';
    const dbSize = mockPostDocArr.length;

    it('create() and push to mock db', async () => {
      const post = await service.create({
        posterUrl: 'create.com',
        title: 'created title',
        summary: 'created summary',
        content: 'crated content',
        tags: ['created', 'tags'],
        lastModifiedDate: new Date(),
      });
      mockPostDocArr.push(post as Partial<PostDocument>);
      expect(post).toHaveProperty('_id');
      postId = post._id;
    });
    it('update() update the post in mock db', async () => {
      const updatedPost = await service.update({
        id: postId,
        ...mockPost(postId, 'updated.com', 'updated title'),
      });
      expect(updatedPost.title).toBe('updated title');
      expect(mockPostDocArr.length).toBe(dbSize + 1);
    });
    it('deleteOneById() delete the post from mock db', async () => {
      const removedPost = await service.deleteOneById(postId);
      expect(removedPost.title).toBe('updated title');
      expect(removedPost._id).toBe(postId);
      expect(mockPostDocArr.length).toBe(dbSize);
    });
  });

  //TODO
  it('shold updatePV', () => {});
  it('shold updateLike', () => {});
  it('shold getAllTags', () => {});
});
