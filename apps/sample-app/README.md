# ts-turborepo-boilerplate: sample-app

> Note: use this app as reference but preferred way is to re-write app
> from zero instead of refactoring this one.
> When you don't need this anymore, you can delete it

Sample app that uses [sample-lib](../../packages/sample-lib) Blockchain
provider to fetch Vitalik and Zero address native balance and sums them

## Setup

1. Change package name to your own in [`package.json`](./package.json)
2. Install dependencies running `pnpm install`

### ⚙️ Setting up env variables

We are using dotenvx to manage the project environment variables.

-   Create `.env` file and copy paste `.env.example` content in there.

```
$ cp .env.example .env
```

Available options:
| Name | Description | Default | Required | Notes |
|-----------------------------|--------------------------------------------------------------------------------------------------------------------------------|-----------|----------------------------------|-----------------------------------------------------------------|
| `RPC_URL` | RPC URL to use for querying balances | N/A | Yes | |

-   Encrypt the `.env` file and get your `.env.keys`

```bash
$ pnpm env:encrypt
```

Note that your `.env` file will be encrypted and tracked by git but the `.env.keys` won't.

To add a new env variable use the `pnpm env:set` command

```bash
pnpm env:set <key> <value>
```

To get the value of an encrypted env variable, use the `pnpm env:get` command.

```bash
pnpm env:get <key>
```

## Available Scripts

Available scripts that can be run using `pnpm`:

| Script         | Description                                                      |
| -------------- | ---------------------------------------------------------------- |
| `build`        | Build library using tsc                                          |
| `check-types`  | Check types issues using tsc                                     |
| `clean`        | Remove `dist` folder                                             |
| `env:decrypt`  | Decrypt the .env file                                            |
| `env:encrypt`  | Encrypt the .env file                                            |
| `env:get`      | Get the value of an encrypted env var                            |
| `env:prebuild` | Check if the .env file is encrypted                              |
| `env:set`      | Add a new env var, it will automatically encrypt and add to .env |
| `lint`         | Run ESLint to check for coding standards                         |
| `lint:fix`     | Run linter and automatically fix code formatting issues          |
| `format`       | Check code formatting and style using Prettier                   |
| `format:fix`   | Run formatter and automatically fix issues                       |
| `start`        | Run the app — it will automatically inject the encrypted env     |
| `test`         | Run tests using vitest                                           |
| `test:cov`     | Run tests with coverage report                                   |
