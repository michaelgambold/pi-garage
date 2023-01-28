import { Injectable } from '@nestjs/common';
import fs from 'node:fs';
import { valid, satisfies, major } from 'semver';

@Injectable()
export class ClientVersionService {
  getServerVersion() {
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    const serverVersion = packageJson.version;

    if (!serverVersion) {
      throw new Error('Failed to read server version');
    }

    return serverVersion;
  }

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
