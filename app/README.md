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

---

## Manual Version & Build Number Updates

When publishing a new release, versions and build numbers must currently be updated manually across the following files:

### 1. App Version (`package.json`)
- File: [`package.json`](package.json)
- Update `"version": "X.Y.Z"` (e.g. `"3.2.2"`).
- *This also automatically updates the in-app version display in the Menu Drawer and the `x-client-version` header sent to the backend.*

### 2. Android Version & Build Code (`build.gradle`)
- File: [`android/app/build.gradle`](android/app/build.gradle)
- Inside `defaultConfig`:
  - `versionName "X.Y.Z"` (matches `package.json`)
  - `versionCode <N>` (must be an integer **strictly greater** than the previous store upload, e.g. `40`)

### 3. iOS Marketing Version & Build Number (`project.pbxproj`)
- File: [`ios/PiGarage.xcodeproj/project.pbxproj`](ios/PiGarage.xcodeproj/project.pbxproj) (or via the **General** tab in Xcode for the `PiGarage` target):
  - `MARKETING_VERSION = X.Y.Z` (matches `package.json`)
  - `CURRENT_PROJECT_VERSION = <N>` (integer build number, e.g. `40`)

### 4. Store Release Notes & Changelogs
- **Android**: Create or update [`android/fastlane/metadata/android/en-AU/changelogs/<versionCode>.txt`](android/fastlane/metadata/android/en-AU/changelogs/) (e.g. `40.txt`).
- **iOS**: Update [`ios/fastlane/metadata/en-AU/release_notes.txt`](ios/fastlane/metadata/en-AU/release_notes.txt).
- **In-App**: Update the bullet points in [`src/components/ReleaseNotesDialog.tsx`](src/components/ReleaseNotesDialog.tsx) if this release warrants in-app announcement notes.

### 5. Backend Service Version (Only for Breaking / Major Releases)
- File: [`../service/package.json`](../service/package.json)
- The backend accepts any client on the same major version (`major.x.x`). If cutting a major release (e.g. `4.0.0`), bump `service/package.json` to match.

> For the architecture analysis, store constraints, and future CI/CD automation options, see [`../VERSIONING.md`](../VERSIONING.md).

