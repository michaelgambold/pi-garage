# Pi Garage

## Description

Pi Garage is a simple application that allows control of up to 3 garage doors (that can be controlled via hard wired switch).

It comprises of the following 2 main pieces of hardware:

- [Raspberry Pi (full size)](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/)
- [Pimoroni Automation Hat](https://shop.pimoroni.com/products/automation-hat?variant=30712316554)

## Mobile apps

Although Pi Garage has a fully functional API that can be accessed via 3rd party software (such as Home Assistant) an [iOS](https://apps.apple.com/gh/app/pi-garage/id1634928554) and [Android](https://play.google.com/store/apps/details?id=com.michaelgambold.pigarage) app has been created to allow standalone functionality.

## Backend Service Installation

Pi Garage's backend service is packaged as a Docker image [pi-garage](https://hub.docker.com/r/michaelgambold/pi-garage). All dependencies have been included in the image.

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
    volumes:
      - data:/app/data

volumes:
  data:
```

## Configuration environment variables

The following environment variables can be injected into the Docker container:

| Env Variable   | Example Values      | Notes                                                                                                                                           |
| -------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| API_KEY        | `abc123`, `Sec3ret` | Alphanumeric security key that if set will be required for all API requests (except `/health` endpoint).<br />See Security for more information |
| LED_BRIGHTNESS | `10`, `100`, `240`  | 0 will be off and 255 is maximum brightness.<br />By default maximum (255) brightness is set, but a much lower value can be used (< 50).        |

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

## Sequences

> **Important**: In the below examples a duration of 1,000ms is used. It has been observed that having a duration after setting
> relays prevents a lock up condition if the relays are switched at a fast rate. It is strongly recommended to have a minimum
> duration of 1,000ms even for the last step in a sequence.

| Property | Description                                                                            |
| -------- | -------------------------------------------------------------------------------------- |
| index    | The index of the step in the sequence. I.e. index 1 is the first step in the sequence. |
| action   | The action the door must be performing. E.g. `open` or `close`.                        |
| target   | The hardware item on the Automation Hat to manipulate. E.g. `relay1`                   |
| duration | This is the wait time (in milliseconds) after a steps "action" has been done.          |
| door     | What door this should apply to.                                                        |

When a garage door's state is changed to `open` or `closed` it runs a sequence of steps (Currently the same sequence is
ran for all actions). By default this performs a `toggle` a relay for a duration of 1,000ms, then another `toggle` with
a duration of 1,000ms.

By default Door 1 targets Relay 1, Door 2 targets Relay 2 and Door 3 targets Relay 3.

To change what happens in a sequence the API can be used to configure this and there is no limits to the creativity that can be done. A more advanced example is included below.

Say for example you had a garage door that you wanted to control and you also had LED light's inside the garage and outside (say the driveway of) the garage that
can be controlled via solid state relays (driven by digital input 1 and 2 respectively). You could then have the following sequences configured.

**Opening**

- Set digital input 1 `high` (turn on inside garage light)
- Set digital input 2 `high` (turn outside garage light)
- Set relay 1 to `toggle` for a duration of 1,000ms (press switch down)
- Set relay 1 to `toggle` for a duration of 1,000ms (release switch)

**Closing**

- Set digital input 2 `low` (turn off outside garage light)
- Set relay 1 to `toggle` for a duration of 1,000ms (press switch down)
- Set relay 1 to `toggle` for a duration of 120,000ms (release switch then wait 2 minutes)
- Set digital input 1 `low` with a delay of 1,000 ms (turn off inside light)

## API Documentation

The (Swagger) API docs can be found at `/docs` on the host. There you are able to interact with the Pi Garage backend
easily. The Swagger docs are considered the source of truth but more indepth information has been included below.
A best effor to ensure the below documentation is up to date has been made.

## Mobile Apps

Pi Garage has complimentary [iOS](https://apps.apple.com/au/app/pi-garage/id1634928554) and
[Android](https://play.google.com/store/apps/details?id=com.michaelgambold.pigarage) app.

## Home Assistant

Pi Garage can easily be incorporated into Home Assistant by the use of a [RESTfull Command]()

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

<!-- ## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support). -->

<!-- ## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework) -->

## License

Pi Garage is MIT licensed.
