import { AppVersionService, DEFAULT_APP_VERSION } from '../../src/services/appVersionService';
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

  it('returns DEFAULT_APP_VERSION when DeviceInfo returns null or undefined', async () => {
    (DeviceInfo.getVersion as jest.Mock).mockReturnValue(null);
    const version = await service.getAppVersion();
    expect(version).toBe(DEFAULT_APP_VERSION);
  });

  it('falls back to DEFAULT_APP_VERSION if DeviceInfo returns template default 1.0 or 1.0.0', async () => {
    (DeviceInfo.getVersion as jest.Mock).mockReturnValue('1.0');
    const version = await service.getAppVersion();
    expect(version).toBe(DEFAULT_APP_VERSION);
  });

  it('returns valid semver version when DeviceInfo returns 3.2.1', async () => {
    (DeviceInfo.getVersion as jest.Mock).mockReturnValue('3.2.1');
    const version = await service.getAppVersion();
    expect(version).toBe('3.2.1');
  });

  it('normalizes 2-part semver to 3 parts (e.g. 3.2 -> 3.2.0)', async () => {
    (DeviceInfo.getVersion as jest.Mock).mockReturnValue('3.2');
    const version = await service.getAppVersion();
    expect(version).toBe('3.2.0');
  });
});
