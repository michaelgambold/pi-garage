import DeviceInfo from 'react-native-device-info';
import packageJson from '../../package.json';

/**
 * The API client version used for semver compatibility with the backend service.
 * Sourced directly from package.json version (e.g. 3.2.1) to serve as the single source of truth.
 * The backend validates `x-client-version` against its major version (e.g. 3.x.x).
 */
export const API_CLIENT_VERSION: string = packageJson.version || '3.2.1';

export class AppVersionService {
  /**
   * Returns the API client version to send in the `x-client-version` header.
   */
  getApiClientVersion(): string {
    return API_CLIENT_VERSION;
  }

  /**
   * Returns the mobile app version for UI display and release notes tracking.
   */
  async getAppVersion(): Promise<string> {
    try {
      const version = DeviceInfo.getVersion();
      return version || packageJson.version || '1.0.0';
    } catch {
      return packageJson.version || '1.0.0';
    }
  }
}
