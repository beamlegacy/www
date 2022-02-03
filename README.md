# Beam - Beta

[![Netlify Status](https://api.netlify.com/api/v1/badges/27a73f38-a2f9-4d0d-a15e-3d5d61b23d61/deploy-status)](https://app.netlify.com/sites/beamapp/deploys)

Beta signup page for Beam app.

## Build

Install dependencies

```sh
yarn
```

## Building for dev
This will launch a dev build and watch for changes

```sh
yarn start
```

To serve the dev build, you can then run:

```sh
yarn serve:dev
```

## Building for production

```sh
yarn build
```

## Serving any other build locally

If you need to, you can manually run the `serve` utility and specify the path to be served, as well as the port
to listen to:

```sh
yarn serve path_to_your_folder -l 8000
```

## Env.json

The file `env.json` contains the env related settings and some common settings:

- for each env:
  - path: the build path where the compiled project will be outputted
  - replacements:
    - config:
      - url: the website url for files that should use full absolute urls like open graph tags
- the other common settings are relative path of the css and js bundles


