# maison-nolae-front

[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest) [![built with TypeScipt](https://badgen.net/badge/types/TypeScript)](https://www.typescriptlang.org)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=shield)](https://github.com/prettier/prettier)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dwyl/esta/issues)

## Installation

```bash
yarn install
yarn run preset:env
```

## Run

Standalone:

```bash
yarn build
yarn start
```

### Linter

This project use [ESLint](https://eslint.org/) as linter with a ci hook.

To configure text editor, see [this link](https://eslint.org/docs/user-guide/integrations).

To run linter : `yarn run lint`

To run linter with auto-fix : `yarn run lint:fix`

### Tests

Standalone:

```bash
yarn test
```

Watch:

```bash
yarn run test:watch
```

In docker (watch):

```bash
docker-compose up
```
