import { Logger, Module } from '@nestjs/common';
import { DoorsModule } from './doors/doors.module';
import { HealthModule } from './health/health.module';
import { AutomationHatModule } from './automation-hat/automation-hat.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MikroORM, UseRequestContext } from '@mikro-orm/core';
import { DatabaseSeeder } from './seeders/DatabaseSeeder';
import { Door } from './entities/Door.entity';

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
  private readonly logger = new Logger(AppModule.name);

  constructor(private readonly orm: MikroORM) {}

  @UseRequestContext()
  async onModuleInit(): Promise<void> {
    await this.orm.getMigrator().up();
    await this.orm.getSeeder().seed(DatabaseSeeder);

    // Get all doors and if they are opening or closing set them to open/closed.
    // This must be done as if pi garage is powered off or get's "stuck" at these states
    // it is impossible to then open/close the door (as it thinks it is currently opening/closing)
    const doors = await this.orm.em.find(Door, {});

    for (const door of doors) {
      if (door.state === 'opening') {
        this.logger.log(`Setting door ${door.id} to open`);
        door.state = 'open';
      } else if (door.state === 'closing') {
        this.logger.log(`Setting door ${door.id} to closed`);
        door.state = 'closed';
      }
    }

    await this.orm.em.flush();
  }

  // for some reason the auth middlewares in profile and article modules are fired before the request context one,
  // so they would fail to access contextual EM. by registering the middleware directly in AppModule, we can get
  // around this issue
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(MikroOrmMiddleware).forRoutes('*');
  // }
}
