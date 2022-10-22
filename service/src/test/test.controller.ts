import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { HttpApiKeyAuthGuard } from '../auth/http-api-key-auth.guard';

@UseGuards(HttpApiKeyAuthGuard)
@ApiSecurity('api-key')
@Controller('test')
export class TestController {
  @Get()
  async test() {
    return;
  }
}
