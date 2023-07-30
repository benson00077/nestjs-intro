import { Module } from '@nestjs/common';
import { GraphqlModule } from './graphql/graphql.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { PostsModule } from './posts/posts.module';
import { PostStatisticsModule } from 'post-statistics/post-statistics.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    GraphqlModule,
    PostsModule,
    PostStatisticsModule,
    UserModule,
    AuthModule,
    // ProductModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  //   {
  //     provide: APP_PIPE,
  //     useClass: GraphQLValidationPipe,
  //   },
  ],
})
export class AppModule {}
