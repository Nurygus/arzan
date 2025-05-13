## Prerequisites

- [Node.js](https://nodejs.org) (`>= 14.0.0`)
- [Yarn](https://yarnpkg.com/en/docs/install) or [NPM](https://docs.npmjs.com/getting-started/installing-node)

## Config

- Copy `.env.example` a file at the root of the application.
- Add or modify specific variables and update it according to your need.

```bash
 cp .env.example .env
```

> Check the `config` folder to customize your settings (`/src/config`)

<br>
<br>

## Local Development

Run the server locally. It will be run with Nodemon and ready to serve on port `8080` (unless you specify it on your `.env`)

```bash
 yarn start # or npm start
```

<br>
<br>

## Production

First, build the application.

```bash
 yarn build # or npm run build
```

Then, use [`pm2`](https://github.com/Unitech/pm2) to start the application as a service.

```bash
 yarn service:start # or npm run service:start
```

<br>
<br>

# Author & Credits

<a src="https://github.com/Seyit47">
<img width="60px" style="border-radius: 50%;" src="https://avatars.githubusercontent.com/Seyit47">
</a>
