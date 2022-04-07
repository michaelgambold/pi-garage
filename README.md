# Pi Garage

## Issues/Workarounds

There is an issue with installing packages in the service project on MacOS 12.3. It causes a node-gyp error for sqlite3 due to python not being found.
A work around (on MacOS 12.3) is run `npm i --build-from-source --python=/opt/homebrew/bin/python3` instead.

## Projects

- app &rarr; mobile app
- docs &rarr; main documentation project
- service &rarr; backend service on raspberry pi

## Licence

Pi Garage is [MIT licensed](LICENSE).
