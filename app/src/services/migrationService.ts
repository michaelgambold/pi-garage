import { v4 as uuidv4 } from 'uuid';
import { Config } from '../types/config';
import { ConfigRepository } from '../repositories/configRepository';
import { LocalStorageService } from './localStorageService';

export class MigrationService {
  async runAll(): Promise<void> {
    await this._migrateSingleConfigToMultipleConfig();
  }

  private async _migrateSingleConfigToMultipleConfig(): Promise<void> {
    const localStorage = LocalStorageService.instance;
    const configRepo = new ConfigRepository();

    // If new configs are already defined, skip migration
    if (await localStorage.containsKey('configs')) {
      return;
    }

    // Extract old config items
    const fqdn = await localStorage.getStringValue('global_fqdn');
    const apiKey = await localStorage.getStringValue('global_api_key');

    if (!fqdn && !apiKey) {
      return;
    }

    // Create new config item
    const config: Config = {
      id: uuidv4(),
      name: 'default',
      fqdn,
      apiKey: apiKey || null,
    };

    await configRepo.updateAllConfigs([config]);
    await configRepo.setCurrentConfig(config.id);

    // Remove old config items
    await localStorage.removeValue('global_fqdn');
    await localStorage.removeValue('global_api_key');
  }
}
