import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ClientVersionModule } from '../client-version/client-version.module';
import { TestController } from './test.controller';

@Module({
  imports: [AuthModule, ClientVersionModule],
  controllers: [TestController],
})
export class TestModule {}
