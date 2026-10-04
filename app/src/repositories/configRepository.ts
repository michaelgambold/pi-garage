import { Config } from '../types/config';
import { LocalStorageService } from '../services/localStorageService';

export class ConfigRepository {
  private _localStorageService = LocalStorageService.instance;

  async findAllConfigs(): Promise<Config[]> {
    const configStrings = await this._localStorageService.getStringListValue('configs');
    return configStrings.map(item => {
      try {
        return typeof item === 'string' ? JSON.parse(item) : item;
      } catch {
        return null;
      }
    }).filter((c): c is Config => c !== null);
  }

  async findConfig(id: string): Promise<Config | undefined> {
    const configs = await this.findAllConfigs();
    return configs.find(element => element.id === id);
  }

  async findCurrentConfig(): Promise<Config | null> {
    const currentConfigId = await this._localStorageService.getStringValue('currentConfigId');
    const configs = await this.findAllConfigs();
    if (!configs.length) return null;
    const found = configs.find(element => element.id === currentConfigId);
    return found || configs[0] || null;
  }

  async setCurrentConfig(id: string): Promise<void> {
    await this._localStorageService.setStringValue('currentConfigId', id);
  }

  async updateAllConfigs(configs: Config[]): Promise<void> {
    const jsonStrings = configs.map(e => JSON.stringify(e));
    await this._localStorageService.setStringListValue('configs', jsonStrings);
  }

  async addConfig(config: Config): Promise<void> {
    const configs = await this.findAllConfigs();
    configs.push(config);
    await this.updateAllConfigs(configs);
  }

  async removeConfig(id: string): Promise<void> {
    const configs = await this.findAllConfigs();
    const updated = configs.filter(element => element.id !== id);
    await this.updateAllConfigs(updated);
  }

  async updateConfig(config: Config): Promise<void> {
    const configs = await this.findAllConfigs();
    const index = configs.findIndex(element => element.id === config.id);
    if (index !== -1) {
      configs[index] = config;
      await this.updateAllConfigs(configs);
    }
  }
}
