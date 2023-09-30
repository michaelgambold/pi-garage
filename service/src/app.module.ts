import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';

import { DoorsModule } from './doors/doors.module';
import { HealthModule } from './health/health.module';
import { AutomationHatModule } from './automation-hat/automation-hat.module';
import { AuthModule } from './auth/auth.module';
import { MikroORM, UseRequestContext } from '@mikro-orm/core';
import { DatabaseSeeder } from './seeders/DatabaseSeeder';
import { Door } from './entities/Door.entity';
import { TestModule } from './test/test.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { ClientVersionModule } from './client-version/client-version.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { Logger } from './logger/logger';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRoot(),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        },
      }),
    }),
    AuditLogsModule,
    DoorsModule,
    HealthModule,
    AutomationHatModule,
    AuthModule,
    TestModule,
    ClientVersionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  private readonly logger = new Logger(AppModule.name);

  constructor(private readonly orm: MikroORM) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }

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
