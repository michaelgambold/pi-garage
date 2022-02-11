import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { IncomingMessage } from 'http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<IncomingMessage>();

    if (req.headers['x-api-key']) {
      return this.authService.validateApiKey(
        req.headers['x-api-key'] as string,
      );
    }

    // get api key from query parameter and check if it matches key in config
    const matches = req.url.match(/[\?|&]api_key=([a-zA-Z0-9]*)*&?/);

    if (matches && matches[1]) {
      return this.authService.validateApiKey(matches[1]);
    }

    return true;
  }
}
