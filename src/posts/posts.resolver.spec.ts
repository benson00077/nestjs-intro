import { Test, TestingModule } from '@nestjs/testing';
import { PostsResolver } from './posts.resolver';
import { JwtAuthGuard } from '../shared/guard/GraphQLAuth.guard';
import { CanActivate } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post } from './models/post.model';
import { ExternalExceptionFilterContext } from '@nestjs/core/exceptions/external-exception-filter-context';

const mockDB = []
const mockPostsService = {
  create: (input: Post) => {
    const created = {...input, _id: 'uuid'}
    mockDB.push(created)
    return Promise.resolve(created)
  },
  deleteOneById(uuid: string){
    let index: number
    mockDB.forEach((p, i) => { if (p._id === uuid) index = i })
    const removed = mockDB.splice(index, 1)[0]
    return removed
  }
}

describe('PostsResolver', () => {
  let resolver: PostsResolver;

  beforeEach(async () => {
    const mock_ForceFailGuard: CanActivate = { canActivate: jest.fn(() => true) }
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsResolver,
        {
          provide: PostsService,
          useValue: mockPostsService,
        },
      
      ],
    })
    .overrideGuard(JwtAuthGuard).useValue(mock_ForceFailGuard)
    .compile();

    resolver = module.get<PostsResolver>(PostsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('should create one, update one, and delete one', () => {
    it('createPost()', async () => {
      const post = await resolver.createPost({
        posterUrl: 'create.com',
        title: 'created title',
        summary: 'created summary',
        content: 'crated content',
        tags: ['created', 'tags'],
        lastModifiedDate: new Date(),
      })
      expect(post).toHaveProperty('_id')
    })

    it('deletePostById()', async() => {
      const removed = await resolver.deletePostById('uuid')
      expect(removed._id).toBe('uuid')
      expect(mockDB.length).toBe(0)
    })

  })
});
