import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppService } from './app.service';
import { AppController } from './app.controller';
// Env
import { ConfigModule } from './config/config.module';
// DB - mongo
import { DatabaseModule } from './database/database.module';

import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql'
    }),
    PostsModule,
    // ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
