import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { ClientVersionService } from './client-version.service';

@Injectable()
export class WsClientVersionGuard implements CanActivate {
  constructor(private readonly clientVersionService: ClientVersionService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToWs();
    const client = req.getClient<Socket>();
    const clientVersion = client.client.request.headers[
      'x-client-version'
    ] as string;

    // if no client version given assume they are match the latest
    if (!clientVersion) {
      return true;
    }

    const serverVersion = this.clientVersionService.getServerVersion();
    return this.clientVersionService.satisfies(clientVersion, serverVersion);
  }
}
