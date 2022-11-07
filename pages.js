const process = require('process')
const fs = require('fs')

if (!process.browser) {
  require("dotenv").config()
}

class Page {
  constructor(messages, srcPath, chunks = ["index"], launcher) {
    this.messages = messages
    this.srcPath = srcPath
    this.chunks = chunks
    this.launcher = launcher;
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

  get chunks() {
    return this.page.chunks
  }

  get messages() {
    return this.page.messages[this.lang]
  }

  get srcPath() {
    return this.page.srcPath
  }

  get svg() {
    return {
      logoBeam: require('./src/assets/svg/beam-logo.ts'),
    }
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

class HomePage extends Page {
  constructor() {
    super(
      {
        en: new (require('./src/page/home/lang/en'))(),
        fr: new (require('./src/page/home/lang/fr'))()
      },
      "index.html",
      ["index", "home"],
      "Home"
    )
  }
}

class AboutPage extends Page {
  constructor() {
    super(
      {
        en: new (require('./src/page/home/lang/en'))(),
        fr: new (require('./src/page/home/lang/fr'))()
      },
      "about.html",
      ["index", "home"],
      "About"
    )
  }
}

const pages = [
  new HomePage(),
  new AboutPage()
]

const exported = []
pages.forEach(page => {
  exported.push(new LocalizedPage(page, "en"))
  exported.push(new LocalizedPage(page, "fr"))
})

module.exports = exported
