import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { swagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('x-powered-by', false);
  app.setGlobalPrefix('api');
  await swagger(app);
  await app.listen(3000);

  // notify pm2 that app is started
  process.send('ready');
}

bootstrap();
