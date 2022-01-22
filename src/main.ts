import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GraphQLValidation } from './shared/pipes/GraphQLValidation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new GraphQLValidation());
  await app.listen(3000);
}
bootstrap();
