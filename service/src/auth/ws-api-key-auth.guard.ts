import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { IncomingMessage } from 'http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * Auth guard that checks api key
 */
@Injectable()
export class WsApiKeyAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToWs();
    // .getRequest<IncomingMessage>();

    // if the auth service does not have a key defined then allow request
    if (!this.authService.hasApiKey()) {
      return true;
    }

    // if (req.headers['x-api-key']) {
    //   return this.authService.validateApiKey(
    //     req.headers['x-api-key'] as string,
    //   );
    // }

    // get api key from query parameter and check if it matches key in config
    // const matches = req.url.match(/[\?|&]api_key=([a-zA-Z0-9]*)*&?/);

    // if (matches) {
    //   return this.authService.validateApiKey(matches[1]);
    // }

    // throw new UnauthorizedException();
    throw new WsException('Unauthorized');
  }
}
