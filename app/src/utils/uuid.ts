/**
 * Generates an RFC4122 version 4 compliant UUID.
 * Works reliably in React Native/Hermes without requiring external crypto polyfills.
 */
export function generateUuid(): string {
  const globalCrypto = typeof globalThis !== 'undefined' ? (globalThis as any).crypto : null;
  if (globalCrypto && typeof globalCrypto.randomUUID === 'function') {
    return globalCrypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
