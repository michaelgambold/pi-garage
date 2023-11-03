# Upgrading to new Pi Garage versions

## Upgrading to version 2.0.0+

- Version 2.0.0 of the backend service introduced the requirement for Redis.
  This is required as in version 2.0.0 door state (open/closed) and sequence
  processing became an asynchronous action.
- Door state change acceptance is instantaneous and this API method will not
  wait for the sequence to complete. Note that a breaking change for the API
  was not performed as the function of the API did not change but just one
  behaviour.
- As door duration is now required these are required properties. These are
  required only in the backend and default values will be set in database
  migrations.

## Upgrading to version 1.8.0+

- Mobile apps now support multiple configs. A migration tool has been created
  that should perform the migration automatically.
  However if this does not occur the configuration will have to be setup again.
- It has been observed with a low number of users that the mobile app may have
  to be force closed after migration to this version.

## Upgrading to version 1.7.0+

- Client version is now included in all mobile app requests to backend.
- Pre 1.7.0 versions of the mobile apps will behave as if they are the latest
  versions. It is advisable to update your mobile app to the latest version.
