import { Test, TestingModule } from '@nestjs/testing';
import { ClientVersionService } from './client-version.service';

describe('ClientVersionService', () => {
  let service: ClientVersionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientVersionService],
    }).compile();

    service = module.get<ClientVersionService>(ClientVersionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Get server version', () => {
    it('should get server version', () => {
      expect(service.getServerVersion()).toBeTruthy();
    });
  });

  describe('Satisfies', () => {
    it('should be valid for same version', () => {
      const client = '1.5.0';
      const server = '1.5.0';
      expect(service.satisfies(client, server)).toEqual(true);
    });

    it('should be valid for patch versions (client > server)', () => {
      const client = '1.5.5';
      const server = '1.5.0';
      expect(service.satisfies(client, server)).toEqual(true);
    });

    it('should be valid for patch versions (client < server)', () => {
      const client = '1.5.0';
      const server = '1.5.5';
      expect(service.satisfies(client, server)).toEqual(true);
    });

    it('should be valid for minor versions (client > server)', () => {
      const client = '1.6.0';
      const server = '1.5.5';
      expect(service.satisfies(client, server)).toEqual(true);
    });

    it('should invalid for major versions (client > server)', () => {
      const client = '2.5.5';
      const server = '1.5.5';
      expect(service.satisfies(client, server)).toEqual(false);
    });

    it('should invalid for major versions (client < server)', () => {
      const client = '1.5.5';
      const server = '2.5.5';
      expect(service.satisfies(client, server)).toEqual(false);
    });
  });
});
