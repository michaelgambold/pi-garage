import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { ApiKeyAuthGuard } from '../auth/api-key-auth.guard';

@UseGuards(ApiKeyAuthGuard)
@ApiSecurity('api-key')
@Controller('test')
export class TestController {
  @Get()
  async test() {
    return;
  }
}
