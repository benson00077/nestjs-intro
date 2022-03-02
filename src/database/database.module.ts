import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from 'src/config/config.service';

/**
 *  Async configuration :
 *  https://docs.nestjs.com/techniques/mongodb#async-configuration
 *
 *  inject constant instance of ConfigService
 */
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.getMongoURI(),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
