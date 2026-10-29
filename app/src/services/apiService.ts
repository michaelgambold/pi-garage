import { ConfigRepository } from '../repositories/configRepository';
import { AppVersionService } from './appVersionService';
import { HttpService, HttpResponse } from './httpService';
import { Config } from '../types/config';

export class ApiService {
  private _httpService = new HttpService();
  private _configRepo = new ConfigRepository();
  private _appVersionService = new AppVersionService();

  private async _getHeaders(config: Config): Promise<Record<string, string>> {
    const clientVersion = this._appVersionService.getApiClientVersion();
    return {
      'x-api-key': config.apiKey ?? '',
      'x-client-version': clientVersion,
    };
  }

  async get<T = any>(path: string): Promise<HttpResponse<T>> {
    const config = await this._configRepo.findCurrentConfig();
    if (!config || !config.fqdn) {
      throw new Error('No active Pi Garage server configured');
    }
    const cleanFqdn = config.fqdn.replace(/\/+$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const url = `${cleanFqdn}${cleanPath}`;
    const headers = await this._getHeaders(config);

    return this._httpService.get<T>(url, headers);
  }

  async post<T = any>(path: string, body?: any): Promise<HttpResponse<T>> {
    const config = await this._configRepo.findCurrentConfig();
    if (!config || !config.fqdn) {
      throw new Error('No active Pi Garage server configured');
    }
    const cleanFqdn = config.fqdn.replace(/\/+$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const url = `${cleanFqdn}${cleanPath}`;
    const headers = await this._getHeaders(config);

    return this._httpService.post<T>(url, body, headers);
  }

  async put<T = any>(path: string, body?: any): Promise<HttpResponse<T>> {
    const config = await this._configRepo.findCurrentConfig();
    if (!config || !config.fqdn) {
      throw new Error('No active Pi Garage server configured');
    }
    const cleanFqdn = config.fqdn.replace(/\/+$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const url = `${cleanFqdn}${cleanPath}`;
    const headers = await this._getHeaders(config);

    return this._httpService.put<T>(url, body, headers);
  }
}
