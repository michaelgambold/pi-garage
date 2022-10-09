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
