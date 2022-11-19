import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserInput } from './dtos/update-user.input';
import { UserModel } from './models/user.model';
import { Roles } from './schema/user.schema';
import { UserService } from './user.service';

const mockUser = (id: string): UserModel => ({
  _id: id,
  access_token: 'bar',
  email: `${id}@email.com`,
  username: 'mock',
  password: 'password',
  role: Roles.USER,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const ids = ['dummy1', 'dummy2', 'dummy3'];

const mockUsersArr = ids.map((id) => mockUser(id));

const mockUserMongooseModel = {
  findOne: jest.fn().mockImplementation(({ email }) => {
    const user = mockUsersArr.filter((user) => user.email === email)[0];
    return user;
  }),
  findByIdAndUpdate: jest
    .fn()
    .mockImplementation((id: string, rest: Partial<UpdateUserInput>) => {
      const user = mockUsersArr.filter((user) => user._id === id)[0];
      return { ...user, _id: id, password: rest.password };
    }),
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: mockUserMongooseModel,
        },
      ],
    }).compile();

    service = moduleRef.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findOneByEmail() is defined', async () => {
    const user = await service.findOneByEmail(mockUsersArr[0].email);
    expect(user).toEqual(mockUsersArr[0]);
  });

  it('updateUser() is defined', async () => {
    const { _id } = mockUsersArr[0];
    const pwd = 'newPassword';
    const updated = await service.updateUser({
      id: _id,
      password: pwd,
    });
    expect(updated._id).toBe(_id);
    expect(updated.password).toBe(pwd);
  });
});
