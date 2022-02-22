import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Doors Controller v1 (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/doors (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/doors?api_key=abc123')
      .expect(200)
      .expect([
        { id: 1, label: 'Door 1', isEnabled: true, state: 'closed' },
        { id: 2, label: 'Door 2', isEnabled: true, state: 'closed' },
        { id: 3, label: 'Door 3', isEnabled: true, state: 'closed' },
      ]);
  });

  it('doors/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/doors/1?api_key=abc123')
      .expect(200)
      .expect({ id: 1, label: 'Door 1', isEnabled: true, state: 'closed' });
  });
});
