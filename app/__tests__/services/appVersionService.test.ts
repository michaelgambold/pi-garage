import { AppVersionService, API_CLIENT_VERSION } from '../../src/services/appVersionService';
import DeviceInfo from 'react-native-device-info';

jest.mock('react-native-device-info', () => ({
  getVersion: jest.fn(),
}));

describe('AppVersionService', () => {
  let service: AppVersionService;

  beforeEach(() => {
    service = new AppVersionService();
    jest.clearAllMocks();
  });

  describe('getApiClientVersion', () => {
    it('always returns a valid 3-part semver matching backend 3.x API', () => {
      const apiVersion = service.getApiClientVersion();
      expect(apiVersion).toBe(API_CLIENT_VERSION);
      expect(apiVersion).toBe('3.2.1');
      // Verify it is a valid 3-digit semver
      expect(apiVersion).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });

  describe('getAppVersion', () => {
    it('returns native app version when available', async () => {
      (DeviceInfo.getVersion as jest.Mock).mockReturnValue('1.0');
      const version = await service.getAppVersion();
      expect(version).toBe('1.0');
    });

    it('returns fallback version when DeviceInfo returns null', async () => {
      (DeviceInfo.getVersion as jest.Mock).mockReturnValue(null);
      const version = await service.getAppVersion();
      expect(version).toBe('1.0.0');
    });
  });
});
