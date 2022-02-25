import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GraphQLValidation } from './shared/pipes/GraphQLValidation.pipe';
import { parse } from 'dotenv';
import { readFileSync } from 'fs';
import * as favicon from 'serve-favicon';
import * as path from 'path';
import * as morgan from 'morgan';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { APP_PORT, NODE_ENV } = parse(readFileSync(`env/.env`));
  console.log(NODE_ENV);

  app.use(favicon(path.join(process.cwd(), 'public/nebula.png')));
  app.use(morgan('combined')); // log req,res
  app.use(
    // against XSS
    helmet({
      contentSecurityPolicy: NODE_ENV === 'production' ? undefined : false,
      crossOriginEmbedderPolicy: false,
    }),
  );
  app.enableCors({});
  app.useGlobalPipes(new GraphQLValidation());
  await app.listen(APP_PORT || 3001);
}
bootstrap();
