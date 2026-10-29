import { MigrationService } from '../../src/services/migrationService';
import { LocalStorageService } from '../../src/services/localStorageService';
import { ConfigRepository } from '../../src/repositories/configRepository';

describe('MigrationService', () => {
  const localStorage = LocalStorageService.instance;
  const configRepo = new ConfigRepository();
  const migrationService = new MigrationService();

  beforeEach(async () => {
    await localStorage.removeAll();
  });

  it('migrates legacy global_fqdn and global_api_key when configs key is absent', async () => {
    await localStorage.setStringValue('global_fqdn', 'http://192.168.1.100:3000');
    await localStorage.setStringValue('global_api_key', 'legacy-key-123');

    await migrationService.runAll();

    const configs = await configRepo.findAllConfigs();
    expect(configs).toHaveLength(1);
    expect(configs[0].name).toBe('default');
    expect(configs[0].fqdn).toBe('http://192.168.1.100:3000');
    expect(configs[0].apiKey).toBe('legacy-key-123');

    const currentConfig = await configRepo.findCurrentConfig();
    expect(currentConfig?.id).toBe(configs[0].id);

    // Old keys should be removed
    expect(await localStorage.containsKey('global_fqdn')).toBe(false);
    expect(await localStorage.containsKey('global_api_key')).toBe(false);
  });

  it('skips migration if configs key is already present', async () => {
    await configRepo.updateAllConfigs([
      { id: 'cfg-1', name: 'Existing', fqdn: 'http://example.com', apiKey: null },
    ]);
    await localStorage.setStringValue('global_fqdn', 'http://old.com');

    await migrationService.runAll();

    const configs = await configRepo.findAllConfigs();
    expect(configs).toHaveLength(1);
    expect(configs[0].name).toBe('Existing');
    expect(await localStorage.getStringValue('global_fqdn')).toBe('http://old.com');
  });
});
