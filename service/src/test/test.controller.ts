import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { HttpApiKeyAuthGuard } from '../auth/http-api-key-auth.guard';
import { HttpClientVersionGuard } from '../client-version/http-client-version.guard';

/**
 * Controller for testing connection
 */
@UseGuards(HttpClientVersionGuard, HttpApiKeyAuthGuard)
@ApiSecurity('api-key')
@Controller('test')
export class TestController {
  // TODO: should this be under /api? ie. /api/test or /api/test-connection or /api/auth/test or /api/test-authentication?
  @ApiOperation({ summary: 'Test connection with authentication' })
  @ApiOkResponse({ type: null })
  @Get()
  async test() {
    return;
  }
}
