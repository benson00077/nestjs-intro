import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import { validatePassword } from 'src/shared/utils';
import { Roles, UserDocument } from 'src/user/schema/user.schema';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

const mockUserDocument = (id: string): Partial<UserDocument> => ({
  _id: id,
  email: `${id}@email.com`,
  username: 'mock',
  password: 'hashed',
  role: Roles.USER,
  createdAt: new Date(),
  updatedAt: new Date(),
  isValidPassword: (password: string, hasehdPassword: string) => {
    return password === hasehdPassword;
  },
  toObject: function () {
    return this;
  }, // do NOT use arrow fn for this line
});
const ids = ['dummy1', 'dummy2', 'dummy3'];
const mockUsersArr = ids.map((id) => mockUserDocument(id));

const mockUserService = {
  findOneByEmail: (email) => {
    const user = mockUsersArr.find((user) => user.email === email);
    return Promise.resolve(user);
  },
  findOneByUsername: (username) => {
    const user = mockUsersArr.find((user) => user.username === username);
    return Promise.resolve(user);
  },
  getUserCount: () => 0,
  create: async (input) => {},
  updateUser: (input) => {},
};
const mockJwtService = {
  sign: (payload) => new Date(),
  decode: (encodedJWT) => {},
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = moduleRef.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login function', () => {
    const user = mockUsersArr[0];
    let targetUser = null;
    beforeAll(async () => {
      targetUser = await service.login({
        email: user.email,
        password: user.password,
      });
    });
    it('should return user info with jwt on success', async () => {
      expect(targetUser).toHaveProperty('access_token');
    });
    it('should not reveal user password on success', () => {
      expect(targetUser).toHaveProperty('password');
      expect(targetUser.password).toEqual(
        'NOTICE: GQL have this Filed but I filter it out.',
      );
    });
    it('should not login w/ wrong hashed pwd', async () => {
      try {
        const targetUser = await service.login({
          email: user.email,
          password: 'foo',
        });
      } catch (err) {
        expect(err).toBeInstanceOf(AuthenticationError);
      }
    });
  });

  describe('register funciotn', () => {
    const user = mockUsersArr[0];
    let newCreatedUser = null;
    beforeAll(async () => {
      mockUserService.create = async (input) => {
        const newUser = mockUserDocument('foo');
        return Promise.resolve({ ...input, ...newUser });
      };
      newCreatedUser = await service.register({
        email: 'foo@email.com',
        username: 'foo',
        password: user.password,
      });
    });
    it('should return user info with jwt on success', () => {
      expect(newCreatedUser).toHaveProperty('access_token');
    });
    it('should not reveal user password on success', () => {
      expect(newCreatedUser).toHaveProperty('password');
      expect(newCreatedUser.password).toEqual(
        'NOTICE: GQL have this Filed but I filter it out.',
      );
    });
    it('should throw error if duplicated name or email', async () => {
      try {
        const newCreatedUser = await service.register({
          email: user.email,
          username: user.username,
          password: user.password,
        });
      } catch (err) {
        expect(err).toBeInstanceOf(ForbiddenError);
      }
    });
  });

  describe('changePassword function', () => {
    const user = mockUsersArr[0];
    const newPwd = 'myNewPwd';
    let newPwdHashed = null;
    let updatedUser = null;

    beforeAll(async () => {
      mockJwtService.decode = (encodedJWT) => ({
        email: user.email,
        sub: user._id,
      });
      mockUserService.updateUser = (input) => {
        user.id = input.id;
        user.password = input.password;
        newPwdHashed = input.password;
        return Promise.resolve(user);
      };

      updatedUser = await service.changePassword(
        {
          oldPassword: user.password,
          newPassword: newPwd,
        },
        'Bearer encodedJWT',
      );
    });
    it('should update new hashed password ', () => {
      expect(validatePassword(newPwd, newPwdHashed)).toBeTruthy();
    });
    it('should not reveal password in response', () => {
      expect(updatedUser).toHaveProperty('password');
      expect(updatedUser.password).toEqual(
        'NOTICE: GQL have this Filed but I filter it out.',
      );
    });
    it('sholud not reveal access_token in response', () => {
      expect(updatedUser.access_token).toEqual(
        'NOTICE: GQL have this Filed but I filter it out.',
      );
    });
    it('sholud return the user info', () => {
      expect(updatedUser._id).toBe(user._id);
    });
  });
});
