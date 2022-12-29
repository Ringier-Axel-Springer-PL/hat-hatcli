
## Description
This is a CLI for Head App Template. It is not required, but it facilitates work and project management.

## Installation

```bash
npm i git+http://stash.grupa.onet/scm/hat/hat-cli.git --global
```

## Usage

### setup

From project folder:

```bash 
hat-cli setup
```
then follow the configurator to create/edit profiles for project.

### start

From project folder:

```bash 
hat-cli start --params=\"ts-node --project tsconfig.server.json server.ts\"
```

To run command `ts-node...` with injected environment variables.
