# koa-shell

[![Build Status][travis-image]][travis-url] [![NPM version][npm-image]][npm-url] [![Prettier][prettier-image]][prettier-url] [![License][license-image]][license-url]

_koa-shell_ is a configurable REST-based web server used to execute shell commands, bundled with a web application for convenience.

This can be used to remotely send commands to a computer running on the local network, e.g. one used to manage a smart home network or host a network drive. This can be done through the REST API directly or through the bundled web application.

_koa-shell_ is intended to only be used from within the the local network. I would not recommend exposing this server to the Internet without additional security layers.

![Sample](https://raw.github.com/Shingyx/koa-shell/master/.github/sample.gif)

## Usage

Install _koa-shell_ with either of the following, depending on your preferred package manager:

- `yarn global add koa-shell`
- `npm install --global koa-shell`

Then use it like the following:

```console
$ koa-shell --help
Usage: koa-shell [config.json path (default: config.json)]

$ cd ~/desired/config/json/directory

$ echo '{"name":"My Server","port":80,"commands":['\
>  '{"id":"ping","description":"PONG","script":"echo PONG"},'\
>  '{"id":"lights-on","description":"Turn on the lights","script":"lighton"}'\
>  ']}' > config.json

$ koa-shell
Listening on port 80

$ # ...then in another terminal
$ curl -X POST http://localhost/api/commands/ping
{"success":true,"output":"PONG"}
```

## Configuration

- `name` - Name of the server. Used for the web application's title.
- `port` - Port to host the server on.
- `commands` - Array of available commands to execute.
  - `id` - Unique identifier for the command. This is can only contain alphanumeric characters, hyphens, and underscores.
  - `description` - Text describing what this command achieves.
  - `script` - The script to be executed on the host.

## REST Endpoints

### GET /

Loads the web page shown in the screenshot above. This can be used from anything with a modern web browser, including mobile devices.

### GET /api/config

Gets the config.json which is currently used by the server.

```console
$ curl http://localhost/api/config
{"name":"My Server","port":80,"commands":[{"id":"ping","description":"PONG","scr
ipt":"echo PONG"},{"id":"lights-on","description":"Turns on the lights","script"
:"some-script"}]}
```

### GET /api/commands

Gets information on all commands which can be run on the server.

```console
$ curl http://localhost/api/commands
[{"id":"ping","description":"PONG","script":"echo PONG"},{"id":"lights-on","desc
ription":"Turns on the lights","script":"some-script"}]
```

### GET /api/commands/{id}

Gets information on the command with the provided id.

```console
$ curl http://localhost/api/commands/ping
{"id":"ping","description":"PONG","script":"echo PONG"}
```

### POST /api/commands/{id}

Executes the command with the provided id.

```console
$ curl -X POST http://localhost/api/commands/ping
{"success":true,"output":"PONG"}
```

## Notes

- _koa-shell_ can be imported as a library.
- You may want to use a process manager such as `runit` to manage the server.

[travis-image]: https://img.shields.io/travis/com/Shingyx/koa-shell/master.svg?style=flat-square
[travis-url]: https://travis-ci.com/Shingyx/koa-shell
[npm-image]: https://img.shields.io/npm/v/koa-shell.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/koa-shell
[prettier-image]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://github.com/prettier/prettier
[license-image]: https://img.shields.io/github/license/Shingyx/koa-shell.svg?style=flat-square
[license-url]: https://github.com/Shingyx/koa-shell/blob/master/LICENSE.md
