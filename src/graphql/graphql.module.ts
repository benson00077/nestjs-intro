import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: async () => ({
        driver: ApolloDriver,
        autoSchemaFile: 'schema.gql',
        cors: {
          origin: ['http://localhost:3000', 'http://localhost:3002'],
          credentials: true,
        },
      }),
    }),
  ]
})
export class GraphqlModule{}
