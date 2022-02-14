import { Module } from '@nestjs/common';
import { DoorsModule } from './doors/doors.module';
import { HealthModule } from './health/health.module';
import { AutomationHatModule } from './automation-hat/automation-hat.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRoot({
      entities: ['./dist/entities'],
      entitiesTs: ['./src/entities'],
      dbName: 'pi-garage.sqlite3',
      type: 'sqlite',
      forceUtcTimezone: true, // sqlite does this by default
      metadataProvider: TsMorphMetadataProvider,
      // autoLoadEntities: true,
    }),
    DoorsModule,
    HealthModule,
    AutomationHatModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
