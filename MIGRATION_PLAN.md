# Pi Garage: Flutter to React Native Migration Plan & Requirements

## 1. Executive Summary

This document details the functional, architectural, and operational requirements to migrate the **Pi Garage** mobile application from Flutter to **React Native**.

The migration will:
- Preserve all existing capabilities: real-time door control via Socket.IO, multi-config management, door sequencing, state overriding, audit log inspection, and migration of legacy local settings.
- Reproduce the **Material Design 3** look and feel using `react-native-paper`.
- Preserve existing **Fastlane** workflows for iOS and Android automated deployment and store releases.
- Implement an **automated screenshot pipeline** (using Maestro and visual regression comparisons) to ease the transition and verify visual parity against existing Flutter screens.

---

## 2. Existing Flutter App Analysis

### 2.1 Identity & Metadata
| Property | Value |
|---|---|
| **App Name** | Pi Garage |
| **Android Application ID** | `com.michaelgambold.pigarage` |
| **iOS Bundle Identifier** | `com.michaelgambold.pigarage` (configurable via `IOS_APP_IDENTIFIER`) |
| **Current App Version** | `3.2.1+39` |
| **Backend Compatibility** | Major version matching (`3.x.x`) via `x-client-version` header |

### 2.2 App Architecture & Dependencies
```
Flutter App Architecture:
┌────────────────────────────────────────────────────────┐
│                        Screens                         │
│  Home | Configs | EditConfig | DoorSettings | Sequence │
│              OverrideState | AuditLog                  │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│                 Providers & State                      │
│               CurrentConfigProvider                    │
└──────────────┬───────────────────────────┬─────────────┘
               │                           │
┌──────────────▼────────────┐ ┌────────────▼─────────────┐
│       Repositories        │ │     Realtime / Web       │
│  Door, Config, AuditLog   │ │   Socket.IO (/doors)     │
└──────────────┬────────────┘ └────────────┬─────────────┘
               │                           │
┌──────────────▼────────────┐              │
│    Services & Storage     │              │
│ Http, Api, LocalStorage   │              │
│  Migration, AppVersion    │              │
└──────────────┬────────────┘              │
               │                           │
┌──────────────▼───────────────────────────▼─────────────┐
│               Raspberry Pi Service Backend             │
└────────────────────────────────────────────────────────┘
```

---

## 3. Functional Requirements

### 3.1 Data Models
1. **`Config`**:
   - `id: string` (UUID v4)
   - `name: string`
   - `fqdn: string` (e.g., `http://192.168.1.100:3000`)
   - `apiKey: string | null`
2. **`Door`**:
   - `id: number`
   - `label: string`
   - `isEnabled: boolean`
   - `state: string` (`open`, `closed`, `opening`, `closing`, etc.)
   - `openDuration: number` (ms)
   - `closeDuration: number` (ms)
3. **`UpdateDoor`**:
   - `label: string`
   - `isEnabled: boolean`
   - `openDuration: number`
   - `closeDuration: number`
4. **`SequenceObject`**:
   - `action: 'on' | 'off' | 'high' | 'low'`
   - `duration: number` (ms)
   - `target: 'relay1' | 'relay2' | 'relay3' | 'digitalOutput1' | 'digitalOutput2' | 'digitalOutput3'`
5. **`AuditLog`**:
   - `timestamp: string` (ISO 8601 date-time)
   - `detail: string`

### 3.2 Services & API Contracts
* All HTTP requests include:
  - `Accept: application/json`
  - `Content-Type: application/json` (for POST/PUT)
  - `x-api-key: <apiKey>`
  - `x-client-version: <version>` (Must match server major version `3.x.x`)
  - Request timeout: 5 seconds

| Endpoint | Method | Payload | Expected Response |
|---|---|---|---|
| `/test` | `GET` | None | `200 OK` (success) or `401` (key needed) |
| `/api/v1/doors` | `GET` | None | `200 OK` -> `Door[]` |
| `/api/v1/doors/:id` | `GET` | None | `200 OK` -> `Door` |
| `/api/v1/doors/:id/state` | `POST` | `{ state: 'toggle' }` | `201 Created` |
| `/api/v1/doors/:id` | `PUT` | `UpdateDoor` | `200 OK` |
| `/api/v1/doors/:id/sequence` | `GET` | None | `200 OK` -> `SequenceObject[]` |
| `/api/v1/doors/:id/sequence` | `PUT` | `SequenceObject[]` | `200 OK` |
| `/api/v1/doors/:id/state/override` | `PUT` | `{ state: 'open' \| 'closed' }` | `200 OK` |
| `/api/v1/audit-logs` | `GET` | None | `200 OK` -> `AuditLog[]` |

### 3.3 Real-time Socket.IO Connection
- **Namespace**: `${fqdn}/doors`
- **Transport**: `websocket`
- **Headers**: `{ 'x-api-key': apiKey, 'x-client-version': appVersion }`
- **Events**:
  - `connect`: Emits `doors:list`
  - `doors:list`: Receives updated `Door[]` and refreshes UI
  - `connect_error` & `error`: Displays red snackbar / notification, clears doors on connect error

### 3.4 Local Storage & Startup Migrations
- Storage Keys:
  - `configs`: JSON serialized `Config[]`
  - `currentConfigId`: ID string of active configuration
  - `viewed-release-notes-v${version}`: Boolean
- **Startup Migration (`MigrationService`)**:
  - If `configs` key is absent, inspect `global_fqdn` and `global_api_key`.
  - If present, generate a default config with `uuid.v4()`, populate `configs` and set `currentConfigId`, then delete the legacy keys.

### 3.5 Screen Specifications & Interactions
1. **Home Screen (`/`)**:
   - App Bar with title "Pi Garage" and hamburger menu icon to open drawer.
   - Door Card list with:
     - Large garage door icon button. On press: triggers haptic feedback (`mediumImpact`), calls toggle API. Disabled if `isEnabled == false`.
     - Door label and state: `${door.label} (${door.state})`.
     - 3-dots popup menu: "Settings", "Sequence", "Override State".
   - Pull-to-refresh to re-initiate socket connection and reload doors.
   - First-time release notes dialog popup with dismiss action.
   - Drawer:
     - Header: "Menu", Config dropdown switcher, current app version text.
     - Navigation items: "Configs" and "Audit Log".
2. **Configs Screen (`/configs`)**:
   - List of config cards with name, FQDN, and menu with "Edit" and "Remove".
   - Floating Action Button (+) to create a new config.
   - Pull-to-refresh.
3. **Edit Config Screen (`/configs/:id/edit`)**:
   - Fields: Name (required), FQDN (required), API Key (optional).
   - "Test" button: tests connection against `${fqdn}/test`.
   - "Save" button: validates and commits config. If editing active config, refreshes active state.
4. **Door Settings Screen (`/doors/:id/settings`)**:
   - Checkbox / Switch for `Enabled`.
   - Text inputs for `Label`, `Open Duration (ms)`, `Close Duration (ms)`.
   - "Save" button to commit door settings.
5. **Door Sequence Screen (`/doors/:id/sequence`)**:
   - List of sequence cards: Action dropdown (`on`, `off`, `high`, `low`), Target dropdown (`relay1..3`, `digitalOutput1..3`), Duration input (ms), and delete button.
   - Floating Action Button (+) to append step.
   - "Save" button to submit updated sequence array.
6. **Override Door State Screen (`/doors/:id/override-state`)**:
   - Dropdown with `open` and `closed`.
   - "Save" button to override state.
7. **Audit Log Screen (`/audit-log`)**:
   - Reverse-chronological list of logs with formatted local timestamp (`d MMM y hh:mm:ss a`) and detail.
   - Pull-to-refresh.

---

## 4. UI/UX & Material Design 3 Strategy

To match Flutter's `ThemeData(colorSchemeSeed: Colors.blue)`:
- **UI Library**: `react-native-paper` (v5+), which is built on Google's **Material Design 3 (MD3)** specification.
- **Theme Configuration**:
  ```ts
  import { MD3LightTheme } from 'react-native-paper';

  export const theme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: '#1976D2', // Material Blue
      secondary: '#42A5F5',
    },
  };
  ```
- **Direct Component Equivalents**:
  | Flutter Material Widget | React Native Paper Component |
  |---|---|
  | `Scaffold` / `AppBar` | `Appbar.Header`, `Appbar.Content`, `Appbar.Action` |
  | `Card` | `Card`, `Card.Content` |
  | `Drawer` | `Drawer.Section`, `Drawer.Item` / React Navigation Drawer |
  | `FilledButton` / `TextButton` | `Button mode="contained"` / `Button mode="text"` |
  | `FloatingActionButton` | `FAB` |
  | `PopupMenuButton` | `Menu`, `Menu.Item` |
  | `DropdownButtonFormField` | Paper `TextInput` with Menu or `@react-native-picker/picker` styled with MD3 |
  | `SnackBar` | `Snackbar` |
  | `AlertDialog` | `Dialog`, `Dialog.Title`, `Dialog.Content`, `Dialog.Actions` |
  | `CheckboxListTile` | `Checkbox.Item` |
  | `Icons.garage` | MaterialCommunityIcons `garage` / `garage-variant` |

---

## 5. Automated Screenshot Strategy (Bonus Requirement)

Automated screenshots will serve two critical purposes:
1. **Migration Verification**: Side-by-side comparison with the existing Flutter reference screenshots to ensure visual fidelity.
2. **App Store & Play Store Submissions**: Seamless regeneration for Fastlane metadata.

### 5.1 Proposed Solution: Maestro + Mock Fixture Mode

```
┌────────────────────────────────────────────────────────────┐
│                    Maestro Flow Runner                     │
│  (.maestro/capture-screenshots.yaml)                       │
└─────────────────────────────┬──────────────────────────────┘
                              │
┌─────────────────────────────▼──────────────────────────────┐
│                   React Native App                         │
│            (Launched in Mock/Fixture Mode)                 │
│                                                            │
│   • Preloaded with mock Configs & Doors (Open/Closed)      │
│   • Navigates: Home -> Menu -> Settings -> Sequence ->     │
│                Configs -> Edit Config -> Audit Log         │
└─────────────────────────────┬──────────────────────────────┘
                              │
┌─────────────────────────────▼──────────────────────────────┐
│                    Screenshot Output                       │
│   • Saved to fastlane/screenshots / metadata folders       │
│   • Automated Pixelmatch comparison vs Flutter baselines   │
└────────────────────────────────────────────────────────────┘
```

### 5.2 Why Maestro?
- **Zero native bridge / test code**: Defined entirely in YAML flows.
- **Multi-platform**: Runs identically against iOS Simulators and Android Emulators.
- **Simulator Resizing & Devices**:
  - iOS: `iPhone 8 Plus` (5.5"), `iPhone 14 Plus` (6.5"), `iPad Pro 12.9" 2nd & 6th Gen`.
  - Android: `Pixel 3a`.
- **Command**:
  ```bash
  maestro test .maestro/screenshots.yaml
  ```
- **Visual Regression Comparison**: A lightweight script using `pixelmatch` will diff the output against existing Flutter screenshots stored in `ios/fastlane/screenshots/en-AU/` and `android/fastlane/metadata/android/en-AU/images/phoneScreenshots/` to generate a diff report.

---

## 6. Fastlane & CI/CD Parity

### 6.1 Android Fastlane
- Path: `android/fastlane/Fastfile`
- Keeps identical lanes: `lane :test`, `lane :beta`, `lane :deploy`.
- `upload_to_play_store`:
  - Points to `android/app/build/outputs/bundle/release/app-release.aab`.
  - Uses `ENV['ANDROID_JSON_KEY_FILE']`.
- Signing keystore properties remain driven by `key.properties` or environment variables: `KEYSTORE_FILE`, `STORE_PASSWORD`, `KEY_ALIAS`, `KEY_PASSWORD`.

### 6.2 iOS Fastlane
- Path: `ios/fastlane/Fastfile`
- Keeps identical lanes:
  - `update_signing_settings`: configures manual/automated signing with `Runner.xcodeproj` or `PiGarage.xcodeproj`.
  - `get_ios_certs`: executes `match(type: "appstore")`.
  - `release`: executes `build_app(workspace: "PiGarage.xcworkspace", scheme: "PiGarage")` and `upload_to_app_store(...)`.

### 6.3 GitHub Actions Workflow Updates
- Update `.github/workflows/release-apps.yml`:
  - Replace Flutter action with Node.js setup and `npm ci`.
  - Replace `flutter build appbundle` with `cd android && ./gradlew bundleRelease`.
  - Replace `flutter build ipa --release` with Fastlane `build_app` or Xcode build.
  - Run Fastlane lanes identically.
- Update `.github/workflows/test-build-apps.yml` and `run-unit-tests.yml`:
  - Run `npm test` (Jest) instead of `flutter test`.

---

## 7. Migration Steps & Execution Plan

| Phase | Description |
|---|---|
| **Phase 1: Preparation** | Rename `app` to `app-old`. |
| **Phase 2: Project Initialization** | Initialize React Native project with TypeScript at directory `app`. |
| **Phase 3: Core Infrastructure** | Set up React Native Paper (MD3), React Navigation, Async Storage, and Socket.IO client. |
| **Phase 4: Domain Layer** | Port Models, API Service, Repositories, MigrationService, and Config Context. |
| **Phase 5: UI Implementation** | Implement all 7 screens and components with Material Design 3 fidelity. |
| **Phase 6: Fastlane Configuration** | Port Fastlane configurations, signing configs, and bundle IDs (`com.michaelgambold.pigarage`). |
| **Phase 7: Screenshot Automation** | Add Maestro flow and mock fixture mode for automated screenshot generation and visual diffing. |
| **Phase 8: CI/CD & Tests** | Port unit tests to Jest / RNTL, update GitHub Actions workflows. |
