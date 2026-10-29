import { LocalStorageService } from '../../src/services/localStorageService';

describe('LocalStorageService', () => {
  const service = LocalStorageService.instance;

  beforeEach(async () => {
    await service.removeAll();
  });

  it('sets and gets string values', async () => {
    expect(await service.getStringValue('testKey')).toBe('');
    await service.setStringValue('testKey', 'testValue');
    expect(await service.getStringValue('testKey')).toBe('testValue');
  });

  it('sets and gets boolean values', async () => {
    expect(await service.getBooleanValue('boolKey')).toBe(false);
    await service.setBooleanValue('boolKey', true);
    expect(await service.getBooleanValue('boolKey')).toBe(true);
  });

  it('sets and gets integer values', async () => {
    expect(await service.getIntegerValue('intKey')).toBe(0);
    await service.setIntegerValue('intKey', 42);
    expect(await service.getIntegerValue('intKey')).toBe(42);
  });

  it('sets and gets string list values', async () => {
    expect(await service.getStringListValue('listKey')).toEqual([]);
    await service.setStringListValue('listKey', ['a', 'b', 'c']);
    expect(await service.getStringListValue('listKey')).toEqual(['a', 'b', 'c']);
  });

  it('checks if key exists and removes values', async () => {
    expect(await service.containsKey('item')).toBe(false);
    await service.setStringValue('item', 'val');
    expect(await service.containsKey('item')).toBe(true);
    await service.removeValue('item');
    expect(await service.containsKey('item')).toBe(false);
  });
});
