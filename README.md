# myria-campaign-service

REST-based Web Services for Campaign features

## Prerequisites

The following tools need to be installed:

- [Git](http://git-scm.com/)
- [Node.js 14+](http://nodejs.org/)
- [Docker](https://www.docker.com/get-started/)
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- [NestJS Framework](https://github.com/nestjs/nest)
- [DBeaver Community - Free Universal Database Tool](https://dbeaver.io/download/)
- [Prisma is a modern DB toolkit to query, migrate and model your database](https://prisma.io)

## Installation

```bash
git clone <repository-url>
cd <repository-url>
npm install
```

## Configure environment variables

### Supported environments

- Local
- Dev
- Staging
- Production

### Update values inside the `configs/.config.$ENVIRONMENT.json`

`Noted`: new variables must be added to all file to synchronize with other environments

```bash
.
├── configs
│   ├── config.local.json
│   ├── config.dev.json
│   ├── config.staging.json
|   └── config.prod.json
```

### Update your environment with .env

```bash
cp .example.env .env
# Then update the value for variable in the .env if needed
```

## Running the app on a specific environment

### Docker container

```bash
# start docker container
$ npm run docker:start:$env
```

### Local machine

```bash
# A PostgreSQL instance must ready for connection on host port 5432
## start docker container docker if it does not exist
$ npm run docker:start:db

# start local server
$ npm run start:$env
```

## How to migrate your data

```bash
# Create migration file `Always keep the file there`
## Create the list file of migration with timestamps
## Filename is the module/table need to migrate
### Generate script base on the changes from prisma/schema.prisma file
#### Filename will be generated as: `timestamp_filename/migrate/migrate.sql`

#### RUN FOR DEVELOPMENT MODE only
npx prisma migrate dev --create-only

# Run this command before running `Run migration`
## On your local environment
export IS_LOCAL_MACHINE=true
## Other environments
export IS_LOCAL_MACHINE=false

# Run migration
## Execute all of command for migration for both init database and update changes
## If the migration file name is already executed, then the scripts automatically ignore migration
npx prisma migrate deploy

# Generate prisma client to interact with DB
npx prisma generate

# Seed your data: support on development only
NODE_ENV=development npx prisma db seed
```

## Test

```bash
# unit test for all modules
$ npm run test:integration

# run unit test for each module: npm run test:integration:$module
$ npm run test:integration:project

# test coverage
$ npm run test:cov
```

## Health Check

```bash
curl http://localhost:8090
```

## Source Structure

```bash
.
src
├── app.controller.spec.ts
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── main.ts # start app server
├── modules # contain main modules inside the service
├── shared
└── utils # contain common providers, services, functions
...
```

Each module structure

```bash
.
├── types # contain Data Transfer Object for ex: *.input.ts, *.payload.ts, *.enum.ts
│   └── user-register.payload.ts
│   └── register-user.interface.ts
├── mocks # contain mock for ex: *.mock.ts
│   └── get-user.mock.ts
├── services # interact with database directly for ex: *.handler.ts
│   └── user.handler.ts
├── handlers # main logic of each single feature with repositories and controller
│   ├── user-get-action.handler.ts
│   └── user-register-action.handler.ts
├── tests
│   ├── user-get-action.test.ts
│   └── user-register-action.test.ts
├── user.controller.spec.ts # contain test code(unit test, integration test)
├── user.controller.ts # controller interacts service with the current request
└── user.module.ts # mapping controller, services, repositories ...etc
```

## Collaboration

1. Follow TypeScript Style Guide [Google](https://google.github.io/styleguide/tsguide.html) except filename use dashes and dots as NestJS is following angular e.g `project-create-action.service`
2. Follow [REST Resource Naming Guide](https://restfulapi.net/resource-naming/)
3. Follow Best-Practices in coding:
   - [Clean code](https://github.com/labs42io/clean-code-typescript) make team happy
   - [Return early](https://szymonkrajewski.pl/why-should-you-return-early/) make code safer and use resource Efficiency
   - [Truthy & Falsy](https://frontend.turing.edu/lessons/module-1/js-truthy-falsy-expressions.html) make code shorter
   - [SOLID Principles](https://javascript.plainenglish.io/solid-principles-with-type-script-d0f9a0589ec5) make clean code
   - [DRY & KISS](https://dzone.com/articles/software-design-principles-dry-and-kiss) avoid redundancy and make your code as simple as possible
4. Naming git's branch to link with JIRA ticket `TICKET_NUMBER-description`
5. Make buildable commit and pull latest code from `dev` branch frequently. Enable rebase when pull `$ git config --local pull.rebase true`
6. Use readable commit message [karma](http://karma-runner.github.io/6.3/dev/git-commit-msg.html)

```bash
     /‾‾‾‾‾‾‾‾
🔔  <  Ring! Please use semantic commit messages
     \________


<type>(<scope>): ([issue number]) <subject>
    │      │        |             │
    |      |        |             └─> subject in present tense. Not capitalized. No period at the end.
    |      |        |
    │      │        └─> Issue number (optional): Jira Ticket or Issue number
    │      │
    │      └─> Scope (optional): eg. Articles, Profile, Core
    │
    └─> Type: chore, docs, feat, fix, refactor, style, ci, perf, build, or test.
```
