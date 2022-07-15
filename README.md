# Beam website

| Env       | Url                                  | Status                                                                                                                                                                |
|-----------|--------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `develop` | https://develop-beam-www.netlify.app | [![Netlify Status](https://api.netlify.com/api/v1/badges/9ecfd4c0-c07c-4131-a3f8-0068f41fc255/deploy-status)](https://app.netlify.com/sites/develop-beam-www/deploys) |
| `staging` | https://staging-beam-www.netlify.app | [![Netlify Status](https://api.netlify.com/api/v1/badges/06ce0de2-a379-4cb1-a898-e6690511fa33/deploy-status)](https://app.netlify.com/sites/staging-beam-www/deploys) |
| `prod`    | https://beamapp.co                   | [![Netlify Status](https://api.netlify.com/api/v1/badges/27a73f38-a2f9-4d0d-a15e-3d5d61b23d61/deploy-status)](https://app.netlify.com/sites/beamapp/deploys)          |

## Getting started

- clone the repo
- run `yarn install`
- run `cp .env.example .env`
- run `yarn start:dev`

You will now have a dev server running with hot reloading, always enabled for js, and for styles, based on your preferred env setting

The url to access the dev server will be displayed in the console.

## Pages

Each page is a separate html template file that can be customized independently.  
Add a new page by creating the corresponding html template and add the matching information to the `page` array in `pages.js` (pages are displayed in th the order defined in the array):

```
{
  title: "The title of the page, provided to the html template through <%= htmlWebpackPlugin.options.title %>",
  description: "The description of the page, provided to the html template through <%= htmlWebpackPlugin.options.description %>",
  srcPath: "path/from/src.html"
}
```

By default, every page is injected with the `index` chunk, but if you need to add specific webpack chunks to a particular page, you can do so, by adding a `chunks` property to the page's entry:

```
  chunks: ["index", "lottie", backlinks", ...]
```

**NB:** beware that if you add a `chunks` property, you have to explicitly list <u>all the required chunks</u> your page depends on.

Aside from `title` and `description`, the html templates also have access the `prev` and `next` page urls through `<%= htmlWebpackPlugin.options.prev %>` and `<%= htmlWebpackPlugin.options.next %>`

## Deploys & deploy previews

Any merge request against `develop` triggers a deploy preview on netlify to allow reviewing the build live with a shareable url.

Successfully pushing to either the `develop`, `staging` and `prod` branches automatically deploys the branch to the relevant url.
