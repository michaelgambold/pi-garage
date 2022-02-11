import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IncomingMessage } from 'http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const configApiKey = this.configService.get('API_KEY');

    // no api key defined so security is disabled
    if (!configApiKey) {
      return true;
    }

    const req = context.switchToHttp().getRequest<IncomingMessage>();

    if (req.headers['x-api-key'] === configApiKey) {
      return true;
    }

    // get api key from query parameter and check if it matches key in config
    const matches = req.url.match(/[\?|&]api_key=([a-zA-Z0-9]*)*&?/);

    if (matches && matches[1] === configApiKey) {
      return true;
    }

    return false;
  }
}
