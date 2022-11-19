import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from './config.service';

const envTest = {
  NODE_ENV: 'test',
  APP_PORT: 3001,
  DATABASE_HOST: 'cluster123.foo.bar.mongodb.net',
  DATABASE_COLLECTION: 'test-collection',
  JWT_SECRET_KEY: 'test-jwt-key',
  JWT_EXPIRES_TIME: 1004,
  DATABASE_USER: 'testUser',
  DATABASE_PWD: 'testPwd',
  ALLOW_ORIGIN: "http://localhost:3000,http://localhost:3002",
};

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        {
          provide: ConfigService,
          useValue: new ConfigService('env/test.env'),
        },
      ],
    })
      .useMocker((token) => console.log(token))
      .compile();

    service = moduleRef.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should read env file from ./env/test.env', () => {
    expect(service.getNodeEnv()).toEqual('test');
    expect(service.isEnvTest).toBeTruthy();
  });

  it('should check evn file is valid', () => {
    expect(service.envConfig).toEqual(envTest);
  });

  it('should expose mongoDB URI', () => {
    expect(typeof service.getMongoURI()).toBe('string');
  });

  it('should read getAllowOrigins as string[]', () => {
    expect(service.getAllowOrigins()).toEqual(
      expect.arrayContaining([expect.any(String)])
    );
  })
});
