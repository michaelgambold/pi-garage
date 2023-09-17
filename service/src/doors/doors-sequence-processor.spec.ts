import { Test, TestingModule } from '@nestjs/testing';
import { DoorsSequenceProcessor } from './doors-sequence-processor';

describe('DoorsSequenceProcessor', () => {
  let provider: DoorsSequenceProcessor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DoorsSequenceProcessor],
    }).compile();

    provider = module.get<DoorsSequenceProcessor>(DoorsSequenceProcessor);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
