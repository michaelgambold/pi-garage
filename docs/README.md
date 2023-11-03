# Pi Garage

## Description

Pi Garage is a simple application that allows control of up to 3 garage doors (that can be controlled via hard wired switch).

It comprises of the following 2 main pieces of hardware:

- [Raspberry Pi (full size)](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/)
- [Pimoroni Automation Hat](https://shop.pimoroni.com/products/automation-hat?variant=30712316554)

## Mobile apps

Although Pi Garage has a fully functional API that can be accessed via 3rd party software (such as Home Assistant) an [iOS](https://apps.apple.com/gh/app/pi-garage/id1634928554) and [Android](https://play.google.com/store/apps/details?id=com.michaelgambold.pigarage) app has been created to allow standalone functionality.

### Multiple configurations

As of 1.8.0 the ability to have multiple configurations has been added so that you can quickly and easily control multiple Pi Garage instances.

Click on the image below to see a video demonstration.

[![Pi Garage mulitple config video](https://img.youtube.com/vi/v2JHKtbDgx8/0.jpg)](https://www.youtube.com/watch?v=v2JHKtbDgx8)

## Backend Service Installation

Pi Garage's backend service is packaged as a Docker image [pi-garage](https://hub.docker.com/r/michaelgambold/pi-garage). Most dependencies have
been included in the Docker Image. However some external dependencies are required and they are listed below.

Since v2.0.0 Redis is a requirement to allow internal asynchronous actions. This is simple to setup and has been included in the below Docker
compose file.

> _**Note**: You **MUST** run the container in privillaged mode and as root. This is required to access the Raspberry Pi's GPIO (General Purpose Input/Ouput)._

The simplest way to run/configure the application is by means of a `docker-compose.yml` file. A sample one has been included below.

> _**Note**: In the below example a data volume has been configured. This **IS** required to persist configuration._

```yml
version: "3"

services:
  pi-garage:
    image: michaelgambold/pi-garage
    container_name: pi-garage
    privileged: true
    restart: always
    ports:
      - "80:3000"
    environment:
      API_KEY: abc123
      LED_BRIGHTNESS: 25
      REDIS_HOST: redis
      REDIS_PORT: 6379
    volumes:
      - data:/app/data
    networks:
      - pi-garage

  redis:
    image: redis:5 # Note: I had to use 5 (not 6 or 7) to get redis to start on Rpi 4 with Raspbian (32 bit) GNU/Linux 10 (buster) & Docker 24.0.7
    networks:
      - pi-garage

volumes:
  data:

networks: pi-garage
```

## Configuration environment variables

The following environment variables can be injected into the Docker container:

| Env Variable   | Example Values       | Notes                                                                                                                                           |
| -------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| REDIS_HOST     | `localhost`, `redis` | Hostname/ip address for Redis Host                                                                                                              |
| REDIS_PORT     | `6739`               | Port for Redis host                                                                                                                             |
| API_KEY        | `abc123`, `Sec3ret`  | Alphanumeric security key that if set will be required for all API requests (except `/health` endpoint).<br />See Security for more information |
| LED_BRIGHTNESS | `10`, `100`, `240`   | 0 will be off and 255 is maximum brightness.<br />By default maximum (255) brightness is set, but a much lower value can be used (< 50).        |
|                |                      |                                                                                                                                                 |

## LED Lights

The Automation Hat has several LED lights. Supported LED lights and their function are listed below:

| LED Light      | Function                                            |
| -------------- | --------------------------------------------------- |
| POWER          | Illuminated when Pi Garage is running.              |
| COMMS          | Illuminated while an API request is running.        |
| WARN           | Not currently used.                                 |
| ADC 1, 2, 3    | Not currently used.                                 |
| OUTPUT 1, 2, 3 | Illuminated when Digital Ouput set `high`.          |
| INPUT 1, 2, 3  | Not currently used.                                 |
| RELAY 1, 2, 3  | `NO`/`NC` illuminated when relay set to `on`/`off`. |
|                |                                                     |

## Security

When the `API_KEY` environment variable has been set each API request (except `/health`) needs to attach the API key (or it
will be rejected).

Two modes of sending the API key are supported:

- Using the `x-api-key` HTTP header
- Adding the API key as a URL query parameter `?api_key=API_KEY`

## Client version

> _**NOTE:** For advanced use, not normally requried._

To ensure a best possible experience the iOS and Android mobile apps send their client version (app version) to the backend. This is done automatically (since 1.7.0)

This had 2 major functions:

1. Block incompatible software. Only the same major versions are allowed to communicate.
1. Allow backwards functionality if new functionality is implemented
   that breaks backward compatibilty.

If no client version is specified by the client then it is assumed to be the latest version.

If some specific handling of a request the client version can be specified with the `x-client-version` header for both websockets and HTTP API.

## Doors

Doors may have the following config set for them.

| Propety         | Type      | Example Values | Notes           |
| --------------- | --------- | -------------- | --------------- |
| label           | `string`  | "Door 1"       |                 |
| isEnabled       | `boolean` | `true`         |                 |
| openingDuration | `int`     | 20,000         | In milliseconds |
| closingDuration | `int`     | 20,000         | In milliseconds |
|                 |           |                |                 |

Separate durations for opening and closing have been given to allow fine tuning of times so that the states can be closely
aligned with individual doors. Although the mobile apps may use different units the durations in the API use milliseconds
to be consistent with other durations in Pi Garage.

## Sequences

> **Important**: In the below examples a duration of 1,000ms is used. It has been observed that having a duration after setting
> relays prevents a lock up condition if the relays are switched at a fast rate. It is strongly recommended to have a minimum
> duration of 1,000ms even for the last step in a sequence.

| Property | Description                                                                            |
| -------- | -------------------------------------------------------------------------------------- |
| index    | The index of the step in the sequence. I.e. index 1 is the first step in the sequence. |
| action   | The action the door must be performing. E.g. `open`, `close` or `toggle`.              |
| target   | The hardware item on the Automation Hat to manipulate. E.g. `relay1`                   |
| duration | This is the wait time (in milliseconds) after a steps "action" has been done.          |
| door     | What door this should apply to.                                                        |

When a garage door's state is changed to `open` or `closed` it runs a sequence of steps (Currently the same sequence is
ran for all actions). By default this performs a `toggle` a relay for a duration of 1,000ms, then another `toggle` with
a duration of 1,000ms.

By default Door 1 targets Relay 1, Door 2 targets Relay 2 and Door 3 targets Relay 3.

### V2 Breaking Change

In version 1 of Pi Garage the sequence was expected to be a long lived request so that a large number of possible things
could be done with Pi Garage. Starting with V2 this has been rolled back and the sequence is expected to be the minimum
required to "toggle" a door.

This was done so that the relays and digital IO would be in a "blocking" state for as small a period as possible.
This was a problem with version 1 as it would mean you could not "cancel" an opening or closing door if it had a long
running sequence.

In version 2 the behaviour is that the blocking only occurs whilst the sequence is being ran (for a given door). This
means with the default configuration a door is only "locked" for 2 seconds. This also means that an extra configuration
element for a door (opening and closing times) needs to be added (will be defaulted to a sane value) for the duration of
opening/closing the door as the sequence cannot be the source of truth anymore.

If you require complex sequences after upgrading to version 2 it is advised to use a 3rd party tool and interface with
Pi Garage (such as Home Assistant Automations).

In addition in version 2 the changing state API method has been changed from a synchronous to Asynchronous call. Meaning
it will instantly return confirmation of the state change and perform the action in the background.

## API Documentation

The (Swagger) API docs can be found at `/docs` on the host. There you are able to interact with the Pi Garage backend
easily. The Swagger docs are considered the source of truth but more indepth information has been included below.
A best effort to ensure the below documentation is up to date has been made.

## Integrations

### Home Assistant

Pi Garage can easily be incorporated into Home Assistant by the use of a [RESTfull Command](https://www.home-assistant.io/integrations/rest_command/)

```bash
# Sample set Door 1 state to "toggle"

rest_command:
  toggle_garage_door:
    url: "http://PI_GARAGE_URL/api/v1/doors/1/state"
    method: post
    content_type: "application/json"
    payload: '{"state": "toggle"}'
    headers:
      x-api-key: "API-Key"
```

## License

Pi Garage is MIT licensed.
