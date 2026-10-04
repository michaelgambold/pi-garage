import DeviceInfo from 'react-native-device-info';

export class AppVersionService {
  async getAppVersion(): Promise<string> {
    try {
      const version = DeviceInfo.getVersion();
      return version || '3.2.1';
    } catch {
      return '3.2.1';
    }
  }
}
