import { Module } from '@nestjs/common';
import { ClientVersionService } from './client-version.service';

@Module({
  providers: [ClientVersionService],
  exports: [ClientVersionService],
})
export class ClientVersionModule {}
