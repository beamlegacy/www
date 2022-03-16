interface Page {
  messages: {
    title: string,
    description: string
  }
  srcPath: string
}

const pages: Page[] = [
  {
    messages: {
      title: "Welcome to beam",
      description: "",
    },
    srcPath: "index.html",
  }
]

module.exports = {pages}