import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
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

    // if the auth service does not have a key defined then allow request
    if (!this.authService.hasApiKey()) {
      return true;
    }

    const client: Socket = req.getClient();
    const apiKey = client.client.request.headers['x-api-key'] as string;

    if (this.authService.validateApiKey(apiKey)) {
      return true;
    }

    throw new WsException('Unauthorized');
  }
}
