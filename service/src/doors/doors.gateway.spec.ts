import { Test, TestingModule } from '@nestjs/testing';
import { DoorsGateway } from './doors.gateway';

describe('DoorsGateway', () => {
  let gateway: DoorsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DoorsGateway],
    }).compile();

    gateway = module.get<DoorsGateway>(DoorsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
