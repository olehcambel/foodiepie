require('source-map-support').install();
require('./config');

import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as swagger from './common/swagger';
import { PORT } from './config';
import { AllExceptionFilter } from './filters/all-exception.filter';
import { RolesGuard } from './guards/roles.guard';
import { ResponseInterceptor } from './interceptors/response.interceptor';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('v1');
  // Middlewares
  app.enableCors({ optionsSuccessStatus: 200 });

  const reflector = app.get(Reflector);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
      whitelist: true,
      validationError: { target: false },
    }),
  );
  // TODO: add interceptor, error filter
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalGuards(new RolesGuard(reflector));
  swagger.add(app);

  await app.listen(
    PORT,
    async () => `Application is running on: ${await app.getUrl()}`,
  );
}
bootstrap();