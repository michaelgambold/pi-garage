# Pi Garage

## Description

Pi Garage is a simple application that allows control of up to 3 garage doors (that can be controlled via hard wired switch).

It comprises of the following 2 main pieces of hardware:

- A [Raspberry Pi (full size)](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/)
- A [Pimoroni Automation Hat](https://shop.pimoroni.com/products/automation-hat?variant=30712316554)

## Installation

Pi Garage is packaged in a Docker image [pi-garage](https://hub.docker.com/r/michaelgambold/pi-garage). All dependencies are included in the image.

_**Note**: You **MUST**_ run the container in privillaged mode and as root. This is required to access the Raspberry Pi's GPIO (General Purpose Input/Ouput).

## Running the app

The simplest way to run/configure the application is by means of a `docker-compose.yml` file. A sample one has been included below.

_**Note**: In the below example a data volume has been configured. This **IS** required to persist configuration accross upgrades._

```
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

## Environment variables

The following environment variables can be injected into the Docker container:

| Env Variable   | Example Values      | Notes                                                                                                                                           |
| -------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| API_KEY        | `abc123`, `Sec3ret` | Alphanumeric security key that if set will be required for all API requests (except `/health` endpoint).<br />See Security for more information |
| LED_BRIGHTNESS | `10`, `100`, `240`  | 0 will be off and 255 is maximum brightness.<br />By default maximum brightness is set, but a much lower value can be used.                     |

## LED Lights

The Automation Hat has several LED lights. Supported LED lights and their function are listed below:

| LED Light      | Function                                            |
| -------------- | --------------------------------------------------- |
| POWER          | Illuminated when Pi Garage is running.              |
| COMMS          | Illuminated when API request is running.            |
| WARN           | Not currently used.                                 |
| ADC 1, 2, 3    | Not currently used.                                 |
| OUTPUT 1, 2, 3 | Illuminated when Digital Ouput set `high`.          |
| INPUT 1, 2, 3  | Not currently used.                                 |
| RELAY 1, 2, 3  | `NO`/`NC` illuminated when relay set to `on`/`off`. |

## Security

When the `API_KEY` environment variable has been set each API request needs to attach the API key (or it will be rejected).

Two modes of sending the API key are supported:

- Using the `x-api-key` HTTP header
- Adding the API key as a URL query parameter `?api_key=API_KEY`

## Sequences

When a garage door's state is changed to `open` or `closed` it runs a sequence of steps. By default this just `toggle` a relay for a duration of 1,000ms. I.e. change the state of the relay (from `on` to `off`) then after the duration has elapsed set it back to the original value.

A Sequence Object has the following main properties:

| Property | Description                                                                                       |
| -------- | ------------------------------------------------------------------------------------------------- |
| index    | The index of the step object. I.e. index 1 is the first step in the sequence.                     |
| action   | The action the door must be performing. I.e. `open` or `close`.                                   |
| target   | The hardware item on the Automation Hat to manipulate.                                            |
| duration | If set this will wait for this time (in ms), then will set the target back to the previous state. |
| door     | What door this should apply to.                                                                   |

See the API docs for sample values etc.

By default door 1 will toggle (i.e. turn on then off) relay 1 with a duration of 1000ms. Door 2 will target relay 2 and door 3 will target relay 3.

To change what happens in a sequence the API can be used to configure this and there is no limits to the creativity that can be done. A more advanced example is included below.

Say for example you had a garage door that you wanted to control and you also had LED light's inside the garage and outside (say the driveway of) the garage that
can be controlled via solid state relays (driven by digital input 1 and 2 respectively). You could then have the following sequences configured.

**Opening**

- Set digital input 1 `high` (turn on inside garage light)
- Set digital input 2 `high` (turn outside garage light)
- Set relay 1 to `toggle` for a duration of 1,000ms (open garage door)

**Closing**

- Set digital input 2 `low` (turn off outside garage light)
- Set relay 1 to `toggle` for a duration of 1,000ms (close garage door)
- Delay for 120,000ms (wait 2 minutes)
- Set digital input 1 `low` (turn off inside light)

## API

The (Swagger) API docs can be found at `/docs` on the host. There you are able to interact with Pi Garage easily. The Swagger docs are considered the source of
truth but more indepth information has been included below. A best effor to ensure the below documentation is up to date has been made.

<!-- ## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support). -->

<!-- ## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework) -->

## License

Pi Garage is MIT licensed.
