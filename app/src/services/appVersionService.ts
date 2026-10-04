import DeviceInfo from 'react-native-device-info';

export const DEFAULT_APP_VERSION = '3.2.1';

export class AppVersionService {
  async getAppVersion(): Promise<string> {
    try {
      const rawVersion = DeviceInfo.getVersion();
      if (
        !rawVersion ||
        typeof rawVersion !== 'string' ||
        rawVersion === '1.0' ||
        rawVersion === '0.0.1'
      ) {
        return DEFAULT_APP_VERSION;
      }
      const parts = rawVersion.split('.');
      while (parts.length < 3) {
        parts.push('0');
      }
      const semverVersion = parts.slice(0, 3).join('.');
      if (semverVersion === '1.0.0') {
        return DEFAULT_APP_VERSION;
      }
      return semverVersion;
    } catch {
      return DEFAULT_APP_VERSION;
    }
  }
}
