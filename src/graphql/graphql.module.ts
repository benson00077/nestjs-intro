import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigService } from 'src/config/config.service';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        driver: ApolloDriver,
        autoSchemaFile: 'schema.gql',
        cors: {
          origin: [...configService.getAllowOrigins()],
          credentials: true,
        },
      }),
    }),
  ]
})
export class GraphqlModule{}
