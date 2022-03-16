type Page = {
  messages: {
    metas: {
      title: string,
      description: string
    },
    title: string
  }
  srcPath: string
}

const pages: Page[] = [
  {
    messages: {
      metas: {
        title: "Welcome to beam",
        description: "",
      },
      title: "Welcome to beam"
    },
    srcPath: "index.html",
  }
]

module.exports = {pages}