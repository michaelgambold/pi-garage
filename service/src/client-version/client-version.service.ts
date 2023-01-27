import { Injectable } from '@nestjs/common';
import { valid, satisfies, gte, eq, major, minor } from 'semver';

@Injectable()
export class ClientVersionService {
  satisfies(clientVersion: string, serverVersion: string) {
    if (!valid(clientVersion)) {
      throw new Error('Invalid client version string');
    }

    if (!valid(serverVersion)) {
      throw new Error('Invalid server version string');
    }

    // support only the same major version. any minor/patch are allowed
    const validRange = `${major(serverVersion)}.x.x`;

    return satisfies(clientVersion, validRange);
  }
}
