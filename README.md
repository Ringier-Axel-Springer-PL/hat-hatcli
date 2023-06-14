
## Description
This is a CLI for Head App Template. It is not required, but it facilitates work and project management.

## Installation

```bash
npm i git+https://github.com/ringpublishing/hat-cli.git --global
```

## Usage

### create

This command creates folder with provided name with empty hat-boilerplate inside.

```bash 
hat-cli create {project_name}
hat-cli create newProjectFolder
```

Make sure that such a folder `newProjectFolder` does not exist beforehand.
After this you should run `npm i` and `npm run dev` from project folder.

### setup

From project folder:

```bash 
hat-cli setup
```
then follow the configurator to create/edit profiles for project.

## Notes

### Variant change by request header

There is possibility to change variant by request header `x-websites-config-variant`

## Development of HAT packages

When developing any HAT package eg.`hat-server` by using `hat-boilderplate`, you should use `npm link`

On `hat-server` repository:
```bash
npm link
```

On `hat-boilderplate` repository:
```bash
npm link "hat-server"
```

- After linking repositories, there could be issues with `next`/`react` framework because there are a couple of library instances. To resolve these issues you have to:
    - delete `next` and `react` from HAT package eg.`hat-server` repository `node_modules` folder.
    - do soft link from `hat-server` to `hat-boilderplate`.
        - For windows powershell:
          ```powershell
          cd {your_path}\hat-server\node_modules
          New-Item -ItemType SymbolicLink -Target "{your_path}\hat-boilerplate\node_modules\react" -Path "react"
          New-Item -ItemType SymbolicLink -Target "{your_path}\hat-boilerplate\node_modules\next" -Path "next"
          ```
