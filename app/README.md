# App

Mobile app built with Flutter.

## Getting Started

Install Flutter. On mac this can be installed with

```
$ brew install --cask flutter
```

Updates of Flutter dependencies should be handled by dependabot. To update dependencies as per lock file
run

```
$ flutter pub get
```

To run the app start a phone simulator (Android or iOS) and run

```
$ flutter run
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
- 6.5", iPhone 14
- iPad 12.9 inch 2nd Gen
- iPad 12.9 inch 6th Gen (3rd gen screenshot)

For android the images need to be 16:9 resolution according to the docs so no pixel emulator works.

## Developer Notes

### Dependency Install Notes

Install dependencies

```bash
brew install ruby

```

Configure .zshrc

```bash
# toodo
```
