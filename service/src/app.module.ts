import { Module } from '@nestjs/common';
import { DoorsModule } from './doors/doors.module';
import { HealthModule } from './health/health.module';
import { AutomationHatModule } from './automation-hat/automation-hat.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MikroORM } from '@mikro-orm/core';
import { DatabaseSeeder } from './seeders/DatabaseSeeder';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRoot(),
    DoorsModule,
    HealthModule,
    AutomationHatModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit(): Promise<void> {
    await this.orm.getMigrator().up();
    await this.orm.getSeeder().seed(DatabaseSeeder);
  }

  // for some reason the auth middlewares in profile and article modules are fired before the request context one,
  // so they would fail to access contextual EM. by registering the middleware directly in AppModule, we can get
  // around this issue
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(MikroOrmMiddleware).forRoutes('*');
  // }
}
