import DeviceInfo from 'react-native-device-info';

/**
 * The API client version used for semver compatibility with the backend service.
 * The backend validates `x-client-version` against its major version (e.g. 3.x.x).
 * This is decoupled from the mobile app's native release/store version (e.g. 1.0).
 */
export const API_CLIENT_VERSION = '3.2.1';

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
      return version || '1.0.0';
    } catch {
      return '1.0.0';
    }
  }
}
