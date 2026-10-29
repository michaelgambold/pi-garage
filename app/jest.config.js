module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-drawer-layout|react-native-paper|react-native-vector-icons|react-native-safe-area-context|react-native-screens|react-native-reanimated|react-native-gesture-handler|react-native-worklets|uuid)/)',
  ],
};
