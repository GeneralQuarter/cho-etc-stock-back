import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { promises as fsp } from 'fs';
import { join } from 'path';

export async function swagger(app: INestApplication): Promise<void> {
  const pkgPath = join(__dirname, '..', 'package.json');
  const pkg = JSON.parse(await fsp.readFile(pkgPath, 'utf-8'));

  const options = new DocumentBuilder()
    .setTitle('Choc Etc Stock API')
    .setDescription('Back end of the Choc Etc Stock application')
    .setVersion(pkg.version)
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
}
