import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}

  private getApiKey(): string {
    return this.configService.get('API_KEY');
  }

  validateApiKey(apiKey: string): boolean {
    return this.getApiKey() === apiKey;
  }
}
