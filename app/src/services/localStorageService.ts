import AsyncStorage from '@react-native-async-storage/async-storage';

export class LocalStorageService {
  private static _instance: LocalStorageService;

  private constructor() {}

  public static get instance(): LocalStorageService {
    if (!LocalStorageService._instance) {
      LocalStorageService._instance = new LocalStorageService();
    }
    return LocalStorageService._instance;
  }

  async containsKey(key: string): Promise<boolean> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys.includes(key);
    } catch {
      return false;
    }
  }

  async getBooleanValue(key: string): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value === 'true';
    } catch {
      return false;
    }
  }

  async getIntegerValue(key: string): Promise<number> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? parseInt(value, 10) || 0 : 0;
    } catch {
      return 0;
    }
  }

  async getStringListValue(key: string): Promise<string[]> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (!value) return [];
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  async getStringValue(key: string): Promise<string> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ?? '';
    } catch {
      return '';
    }
  }

  async removeAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.error('Error in removeAll:', e);
    }
  }

  async removeValue(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error(`Error in removeValue(${key}):`, e);
    }
  }

  async setBooleanValue(key: string, value: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(key, String(value));
    } catch (e) {
      console.error(`Error in setBooleanValue(${key}):`, e);
    }
  }

  async setIntegerValue(key: string, value: number): Promise<void> {
    try {
      await AsyncStorage.setItem(key, String(value));
    } catch (e) {
      console.error(`Error in setIntegerValue(${key}):`, e);
    }
  }

  async setStringListValue(key: string, value: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error in setStringListValue(${key}):`, e);
    }
  }

  async setStringValue(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.error(`Error in setStringValue(${key}):`, e);
    }
  }
}
