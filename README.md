
## Description
This is a CLI for Head App Template. It is not required, but it facilitates work and project management.

## Installation

```bash
npm i git+http://stash.grupa.onet/scm/hat/ringhat.git --global
```

## Usage

### create

This command creates folder with provided name with empty hat-boilerplate inside.

```bash 
ringhat create {project_name}
ringhat create newProjectFolder
```

Make sure that such a folder `newProjectFolder` does not exist beforehand.
After this you should run `npm i` and `npm run dev` from project folder.

### setup

From project folder:

```bash 
ringhat setup
```
then follow the configurator to create/edit profiles for project.

