import { Global, Module } from '@nestjs/common';
import { ConfigService } from './config.service';

/**
 *  Since some else module would inject ConfigService's instance
 *  ( without needing to passing in para - 'env/.env' - to initialize another instance ),
 *  useValue syntax is used for injecting Configservice a constant value 
 *  see more : https://docs.nestjs.com/fundamentals/custom-providers#di-fundamentals
 */
@Global()
@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService('env/.env'),
    }
  ],
  exports: [ConfigService]
})
export class ConfigModule {}
