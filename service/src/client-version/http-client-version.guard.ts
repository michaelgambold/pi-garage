import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { IncomingMessage } from 'http';
import { Observable } from 'rxjs';
import { ClientVersionService } from './client-version.service';

@Injectable()
export class HttpClientVersionGuard implements CanActivate {
  constructor(private readonly clientVersionService: ClientVersionService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<IncomingMessage>();
    const clientVersion = req.headers['x-client-version'] as string;

    // if client version is not present allow request as we can assume this is
    // the default latest version. this could be when a 3rd party accesses the api
    if (!clientVersion) {
      return true;
    }

    const serverVersion = this.clientVersionService.getServerVersion();
    return this.clientVersionService.satisfies(clientVersion, serverVersion);
  }
}
