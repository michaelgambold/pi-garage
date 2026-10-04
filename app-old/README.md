# App

Mobile app built with Flutter.

## Getting Started

Install Flutter. Go to the flutter website and install as per recommended way.

Updates of Flutter dependencies should be handled by dependabot. To update dependencies as per lock file
run

```
$ flutter pub get
```

To run the app start a phone simulator (Android or iOS) and run

```
$ flutter run
```

## Widgetbook

To simplify widget creation Widgetbooks has been configured so that individual widgets can be created independent of one another.

See the below commands to run widgetbooks

```bash
# Build widgetbooks
flutter pub run build_runner build

# Watch for changes so you don't have to manually rebuild all the time
flutter pub run build_runner watch

# Run chrome widgetbook UI. Note you have to push "r" as it doesn't auto refresh changes
bash flutter run -d chrome -t lib/widgetbook.dart
```

## Build app icons

The source file is `icon.ai`. A PNG is then created and put into `assets/icons/icon.png`.

You can then run the following commands to generate icons for both android and ios.

```
flutter pub get
flutter pub run flutter_launcher_icons:main
```

## Screenshots

For apple the following devices can be used for correct resolution images

- 5.5", iPhone 8 Plus
- 6.5", iPhone 14 Plus
- iPad 12.9 inch 2nd Gen
- iPad 12.9 inch 6th Gen (3rd gen screenshot)

For android the following devices can be used for correct resolution images

- "Phone Screenshots", Pixel 3a

## Developer Notes

### Dependency Install Notes

Install dependencies

For Mac you need to use ruby 3. The easiest way is to use `rbenv`.

### Upgrade Gems/Fastlane

In the `ios` and `android` folders run the following

```bash
# Update all gems
$ bundle update

```
