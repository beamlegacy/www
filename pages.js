class Page {
  constructor(messages, srcPath) {
    this.messages = messages
    this.srcPath = srcPath
  }
}

class LocalizedPage {
  constructor(page, lang) {
    this.page = page
    this.lang = lang
  }

  get title() {
    return this.messages.metas.title
  }

  get messages() {
    return this.page.messages[this.lang]
  }

  get srcPath() {
    return this.page.srcPath
  }

  get url() {
    const path = this.page.srcPath
      .replace(/^index\.html$/, "")
      .replace(/\/index\.html$/, "")
    return `/${this.lang}/${path}`.replace(/\/$/, "")
  }

  get filename() {
    const path = this.page.srcPath
    return `${this.lang}/${path}`.replace(/^en\//, "")
  }
}

class HomeMessages_en {
  metas = {
    title: "Welcome to beam",
    description: "",
  }

  title = "Welcome to beam"
}

class HomeMessages_fr {
  metas = {
    title: "Bienvenue sur beam",
    description: "",
  }

  title = "Bienvenue sur beam"
}

class HomePage extends Page {
  constructor() {
    super(
      {
        en: new HomeMessages_en(),
        fr: new HomeMessages_fr()
      },
      "index.html"
    )
  }
}

const pages = [
  new HomePage()
]

const exported = []
pages.forEach(page => {
  exported.push(new LocalizedPage(page, "en"))
  exported.push(new LocalizedPage(page, "fr"))
})

module.exports = exported
