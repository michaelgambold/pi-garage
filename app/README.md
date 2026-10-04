# Pi Garage Mobile App (React Native)

Cross-platform mobile application for **Pi Garage**, built with **React Native** and **Material Design 3** (`react-native-paper`).

---

## Getting Started

### Prerequisites
- Node.js >= 20.x
- JDK 17
- Xcode (for iOS) & CocoaPods
- Android Studio & Android SDK (for Android)

### Install Dependencies
```bash
npm install
cd ios && bundle exec pod install && cd ..
```

### Running Locally

#### Android
```bash
npm run android
```

#### iOS
```bash
npm run ios
# Or open ios/PiGarage.xcworkspace in Xcode and hit Run
```

### Running Tests & Type Checks
```bash
npm test
npx tsc --noEmit
```

---

## Material Design 3 (Look & Feel)

The UI is built with `react-native-paper` (v5) implementing Material Design 3 with:
- Blue seed color scheme (`#1976D2`)
- Elevation-based Cards
- Material Appbar Header & Drawer
- Material Floating Action Buttons (FAB)
- Material text inputs and menus

---

## Automated Screenshots (Maestro)

Screenshots can be automatically captured across required devices and resolutions using [Maestro](https://maestro.mobile.dev/):

```bash
# Install Maestro
curl -FsSL "https://get.maestro.mobile.dev" | bash

# Run screenshot flow
maestro test .maestro/screenshots.yaml
```

Target screen sizes for App Store and Google Play:
- **iOS 5.5"**: iPhone 8 Plus
- **iOS 6.5"**: iPhone 14 Plus / 15 Plus
- **iOS 12.9"**: iPad Pro 12.9" 2nd Gen & 6th Gen
- **Android Phone**: Pixel 3a

---

## Publishing with Fastlane

Publishing pipelines remain identical to previous versions using Fastlane.

### Android
```bash
cd android
bundle exec fastlane deploy
```
*Outputs release bundle to `android/app/build/outputs/bundle/release/app-release.aab` and uploads to Google Play.*

### iOS
```bash
cd ios
bundle exec fastlane update_signing_settings
bundle exec fastlane get_ios_certs
bundle exec fastlane release
```
*Builds `PiGarage.xcworkspace` and uploads to App Store Connect.*
