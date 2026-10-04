import { ConfigRepository } from '../../src/repositories/configRepository';
import { LocalStorageService } from '../../src/services/localStorageService';

describe('ConfigRepository', () => {
  const repo = new ConfigRepository();
  const localStorage = LocalStorageService.instance;

  beforeEach(async () => {
    await localStorage.removeAll();
  });

  it('adds, finds, updates, and removes configs', async () => {
    const config1 = { id: '1', name: 'Home', fqdn: 'http://home.local', apiKey: 'k1' };
    const config2 = { id: '2', name: 'Work', fqdn: 'http://work.local', apiKey: null };

    await repo.addConfig(config1);
    await repo.addConfig(config2);

    const all = await repo.findAllConfigs();
    expect(all).toHaveLength(2);

    const found = await repo.findConfig('1');
    expect(found?.name).toBe('Home');

    await repo.updateConfig({ id: '1', name: 'Home Renamed', fqdn: 'http://home.local', apiKey: 'k1' });
    const updated = await repo.findConfig('1');
    expect(updated?.name).toBe('Home Renamed');

    await repo.setCurrentConfig('2');
    const current = await repo.findCurrentConfig();
    expect(current?.id).toBe('2');

    await repo.removeConfig('1');
    const remaining = await repo.findAllConfigs();
    expect(remaining).toHaveLength(1);
    expect(remaining[0].id).toBe('2');
  });
});
