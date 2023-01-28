import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { ClientVersionModule } from '../client-version/client-version.module';
import { TestController } from './test.controller';

describe('TestController', () => {
  let controller: TestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClientVersionModule],
      controllers: [TestController],
      providers: [ConfigService, AuthService],
    }).compile();

    controller = module.get<TestController>(TestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should complete successfully', async () => {
    await controller.test();
  });
});
