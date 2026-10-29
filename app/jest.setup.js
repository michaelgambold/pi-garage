/* eslint-env jest */
require('react-native-gesture-handler/jestSetup');

jest.mock('react-native-worklets', () => ({}));

jest.mock('react-native-reanimated', () => {
  const View = require('react-native').View;
  return {
    default: {
      View,
      createAnimatedComponent: (c) => c,
    },
    useSharedValue: (v) => ({ value: v }),
    useAnimatedStyle: () => ({}),
    withTiming: (v) => v,
    withSpring: (v) => v,
  };
});

const mockAsyncStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn(async (key) => (store[key] !== undefined ? store[key] : null)),
    setItem: jest.fn(async (key, value) => {
      store[key] = String(value);
    }),
    removeItem: jest.fn(async (key) => {
      delete store[key];
    }),
    clear: jest.fn(async () => {
      store = {};
    }),
    getAllKeys: jest.fn(async () => Object.keys(store)),
  };
})();

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('react-native-device-info', () => ({
  getVersion: () => '4.0.0',
}));

jest.mock('react-native-haptic-feedback', () => ({
  trigger: jest.fn(),
}));

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');
