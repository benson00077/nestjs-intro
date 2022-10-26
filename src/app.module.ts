import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppService } from './app.service';
import { AppController } from './app.controller';
// Env
import { ConfigModule } from './config/config.module';
// DB - mongo
import { DatabaseModule } from './database/database.module';

import { PostsModule } from './posts/posts.module';
import { PostStatisticsModule } from 'post-statistics/post-statistics.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      // CORS in GraphQl: https://docs.nestjs.com/security/cors#getting-started
      // cors: true,      
    }),
    PostsModule,
    PostStatisticsModule,
    UserModule,
    AuthModule,
    // ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
