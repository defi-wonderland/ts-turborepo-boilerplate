# ts-turborepo-boilerplate

## Features

### Sample contracts with Foundry

Basic Greeter contract with an external interface

Foundry configuration out-of-the-box

### Lint and format

Use ESLint and Prettier to easily find issues as you code

### Github workflows CI

Lint code and check commit messages format on every push.

Run all tests and see the coverage before merging changes.

## Tech stack

-   [pnpm](https://pnpm.io/): package and workspace manager
-   [turborepo](https://turbo.build/repo/docs): for managing the monorepo and the build system
-   [foundry](https://book.getfoundry.sh/forge/): for writing Solidity smart contracts

### Configuring Prettier sort import plugin

You can further add sorting rules for your monorepo, for example in `.prettierrc` you can add:

```json
    ...
    "importOrder": [
        "<TYPES>",
        ...
        "",
        "<TYPES>^@myproject", //added
        "^@myproject/(.*)$", //added
        "",
        ...
    ],
    ...
```

We use [IanVs prettier-plugin-sort-imports](https://github.com/IanVS/prettier-plugin-sort-imports)

## Contributing

Wonderland is a team of top Web3 researchers, developers, and operators who believe that the future needs to be open-source, permissionless, and decentralized.

[DeFi sucks](https://defi.sucks), but Wonderland is here to make it better.

### 💻 Conventional Commits

We follow the Conventional Commits [specification](https://www.conventionalcommits.org/en/v1.0.0/#specification).

## License

The primary license for the boilerplate is MIT. See the [`LICENSE`](./LICENSE) file for details.
