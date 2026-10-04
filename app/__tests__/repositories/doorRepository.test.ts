import { DoorRepository } from '../../src/repositories/doorRepository';
import { ConfigRepository } from '../../src/repositories/configRepository';

describe('DoorRepository', () => {
  const doorRepo = new DoorRepository();
  const configRepo = new ConfigRepository();

  beforeEach(async () => {
    await configRepo.updateAllConfigs([
      { id: 'test-cfg', name: 'Test', fqdn: 'http://test-server:3000', apiKey: 'test-key' },
    ]);
    await configRepo.setCurrentConfig('test-cfg');
    (globalThis as any).fetch = jest.fn();
  });

  it('findAllDoors returns door list on 200', async () => {
    const mockDoors = [
      { id: 1, label: 'Door 1', isEnabled: true, state: 'open', openDuration: 1000, closeDuration: 1000 },
    ];

    ((globalThis as any).fetch as jest.Mock).mockResolvedValueOnce({
      status: 200,
      statusText: 'OK',
      text: async () => JSON.stringify(mockDoors),
    });

    const result = await doorRepo.findAllDoors();
    expect(result).toEqual(mockDoors);
    expect((globalThis as any).fetch).toHaveBeenCalledWith(
      'http://test-server:3000/api/v1/doors',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'x-api-key': 'test-key',
          'x-client-version': '3.2.1',
        }),
      }),
    );
  });

  it('changeDoorState sends toggle state', async () => {
    ((globalThis as any).fetch as jest.Mock).mockResolvedValueOnce({
      status: 201,
      statusText: 'Created',
      text: async () => '',
    });

    await doorRepo.changeDoorState(1, 'toggle');
    expect((globalThis as any).fetch).toHaveBeenCalledWith(
      'http://test-server:3000/api/v1/doors/1/state',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ state: 'toggle' }),
      }),
    );
  });
});
