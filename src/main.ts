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
  console.log('\x1b[36m%s\x1b[0m', '    NODE_ENV is :', NODE_ENV);

  app.use(favicon(path.join(process.cwd(), 'public/nebula.png')));
  // morgan for logging req,res
  app.use(
    morgan(
      NODE_ENV === 'development'
        ? ':method :url :status :res[content-length] - :response-time ms - Referer :user-agent'
        : 'combined',
    ),
  );

  app.use(
    // against XSS
    helmet({
      contentSecurityPolicy: NODE_ENV === 'production' ? undefined : false,
      crossOriginEmbedderPolicy: false, // by default in Helmet v5.
      hidePoweredBy: true, // by default in Helmet
    }),
  );
  // app.enableCors({});
  app.useGlobalPipes(new GraphQLValidation());
  await app.listen(APP_PORT || 3001);
}
bootstrap();
