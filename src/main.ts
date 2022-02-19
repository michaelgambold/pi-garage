import { MikroORM } from '@mikro-orm/core';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DatabaseSeeder } from '../seeders/DatabaseSeeder';
import { AppModule } from './app.module';

async function bootstrap() {
  const orm = await MikroORM.init();

  const migrator = orm.getMigrator();
  await migrator.up();

  const seeder = orm.getSeeder();
  await seeder.seed(DatabaseSeeder);

  await orm.close();

  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'api-key')
    .setTitle('Pi Garage')
    .setDescription('Pi Garage API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}
bootstrap();
