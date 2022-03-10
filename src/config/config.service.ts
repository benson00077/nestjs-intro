import { Injectable } from '@nestjs/common';

import { parse } from 'dotenv';
import { readFileSync } from 'fs';
import * as Joi from 'joi';

// TODO: Implement env APP_PORT (default 3001) logic

export type EnvConfig = Record<string, any>;

@Injectable()
export class ConfigService {
  public readonly envConfig: EnvConfig;

  public readonly isEnvProduction: boolean;

  public readonly isEnvDevelopment: boolean;

  public readonly isEnvTest: boolean;

  constructor(envPath: string) {
    const _config = parse(readFileSync(envPath));
    const { NODE_ENV } = _config;
    if (!NODE_ENV || NODE_ENV === 'undefined' || NODE_ENV === 'null') {
      throw new Error(
        'Please define NODE_ENV in env/.env as development or production',
      );
    }
    const __config = parse(readFileSync(`env/${NODE_ENV}.env`));
    const config = { ..._config, ...__config };

    this.envConfig = this.validateEnvFile(config);
    this.isEnvProduction = this.getNodeEnv() === 'production';
    this.isEnvDevelopment = this.getNodeEnv() === 'development';
    this.isEnvTest = this.getNodeEnv() === 'test';
  }

  public getNodeEnv(): string {
    return this.get('NODE_ENV');
  }

  public getMongoURI() {
    // mongodb+srv://<username>:<password>@cluster0.tfxvt.mongodb.net/nestjs-intro?retryWrites=true&w=majority
    const userName = this.get('DATABASE_USER');
    const userPwd = this.get('DATABASE_PWD');
    const prefix = 'mongodb+srv://';
    const auth = `${userName}:${userPwd}`;
    const host = this.get('DATABASE_HOST');
    const collection = this.get('DATABASE_COLLECTION');

    return `${prefix}${auth}@${host}/${collection}?retryWrites=true&w=majority`;
  }

  public getJWTSecretKey(): string {
    return this.get('JWT_SECRET_KEY');
  }

  public getJWTExpiresTime(): number {
    return this.get('JWT_EXPIRES_TIME');
  }

  private validateEnvFile(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development')
        .required(),
      APP_PORT: Joi.number().default(3001).required(),
      DATABASE_HOST: Joi.string().required(),
      DATABASE_COLLECTION: Joi.string().required(),
      DATABASE_USER: this.isEnvProduction
        ? Joi.string().required()
        : Joi.string().optional(),
      DATABASE_PWD: this.isEnvProduction
        ? Joi.string().required()
        : Joi.string().optional(),
      JWT_SECRET_KEY: Joi.string().required(),
      JWT_EXPIRES_TIME: Joi.number().required(),
    });

    const { error, value } = envVarsSchema.validate(envConfig);
    if (error) throw new Error(`Config validation error: ${error.message}`);
    return value;
  }

  private get<T>(key: string): T {
    return this.envConfig[key];
  }
}
