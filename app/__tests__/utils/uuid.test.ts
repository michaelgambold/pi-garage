import { generateUuid } from '../../src/utils/uuid';

describe('generateUuid', () => {
  it('generates a valid UUID v4 string format', () => {
    const uuid = generateUuid();
    expect(uuid).toBeDefined();
    expect(typeof uuid).toBe('string');
    // Standard UUID v4 regex: 8-4-[4]-([89ab])-12 hex chars
    const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(uuid).toMatch(uuidV4Regex);
  });

  it('generates unique UUIDs across multiple calls', () => {
    const ids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      ids.add(generateUuid());
    }
    expect(ids.size).toBe(100);
  });
});
