const process = require('process')
if (!process.browser) {
  require("dotenv").config()
}

class Page {
  constructor(messages, srcPath, chunks = ["index"]) {
    this.messages = messages
    this.srcPath = srcPath
    this.chunks = chunks
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
    title: "Meet the bright web – beam",
    description: "Browse. Capture. Write. Publish – Coming soon to macOS. Join the beta now.",
    ogTitle: "Meet the bright web – beam",
    ogUrl: process.env.CANONICAL_HOST,
    ogImage: `${process.env.CANONICAL_HOST}/social/beam.gif`,
    ogDescription: "Browse. Capture. Write. Publish – Coming soon to macOS. Join the beta now.",
    twitterSite: "getonbeam",
    twitterTitle: "Meet the bright web – beam",
    twitterImage: `${process.env.CANONICAL_HOST}/social/beam.gif`
  }

  header = {
    betaSignup: "Sign up for beta",
    betaSignupPlaceholder: "Enter your e-mail address...",
    betaSignupError: "We couldn't save your email, please try again",
    betaSignupSuccess: "Got it! We'll be in touch shortly",
  }

  title = "Meet the bright web"
  subtitle = "Browse.  Capture.  Write.  Publish."

  demo = {
    title: "Beneath your&nbsp;<br/><strong class=\"in\">browser</strong>…"
  }

  footer = {
    year: new Date().getFullYear(),
    twitterUrl: "https://twitter.com/getonbeam",
    twitter: "Twitter",
    aboutUrl: "https://angel.co/company/beam-app-1",
    about: "About",
    jobsUrl: "https://angel.co/company/beam-app-1/jobs",
    jobs: "Jobs",
    whyUrl: "https://public.beamapp.co/beam/note/c5ef3f23-5864-45ad-943e-b75b093555e1/Bright-Paper",
    why: "Why beam?"
  }

  tabs = {
    journal: "Journal",
    allNotes: "All notes",
    note: "Note",
    bmail: "Welcome to beam! - bmail",
    beamTimes: "The beam Times - Breaking News",
    youtube: "You On Kazoo! - YouTube"
  }

  journal = {
    today: {
      title: "Today",
      line1: "Markdown support",
      line2: "Backlinks",
      line3: "Encrypted end-to-end",
      line4: "Organized around your Journal",
    },
    yesterday: {
      title: "Yesterday",
      line1: "⌘K to search the web & your notes",
      line2: "⌘D to toggle between the web & your notes",
      line3: "Hold ⌥ & click to capture everything on the web"
    }
  }

  note = {
    title: "Note",
    publish: {
      error: "Error",
      publish: "Publish",
      publishing: "Publishing...",
      published: "Published!",
      unpublish: "",
      unpublishing: "",
      unpublished: "",
      url_copied: "URL copied"
    }
  }

  animation = {
    titles: [
      "A <br><strong class=\"in\">powerful note</strong> app…",
      "So you can <br><strong class=\"in\">capture</strong> the web…",
      "Make it <br><strong class=\"in\">your own</strong>…",
      "And <strong class=\"in\">share it</strong> <br>with the world",
      "<strong class=\"in\">Sign up</strong> <br>for the beta now <span class=\"arrow\">-&gt;</span>",
    ]
  }
}

class HomeMessages_fr {
  metas = {
    title: "Bienvenue sur beam",
    description: "Browse. Capture. Write. Publish – Meet the bright web",
    ogTitle: "Meet the bright web – beam",
    ogUrl: process.env.CANONICAL_HOST,
    ogImage: `${process.env.CANONICAL_HOST}/social/beam.gif`,
    ogDescription: "Browse. Capture. Write. Publish – Coming soon to macOS. Join the beta now.",
    twitterSite: "getonbeam",
    twitterTitle: "Meet the bright web – beam",
    twitterImage: `${process.env.CANONICAL_HOST}/social/beam.gif`
  }

  header = {
    betaSignup: "Sign up for beta",
    betaSignupPlaceholder: "Enter your e-mail address...",
    betaSignupError: "We couldn't save your email, please try again",
    betaSignupSuccess: "Got it! We'll be in touch shortly",
  }

  title = "Meet the bright web"
  subtitle = "Browse.  Capture.  Write.  Publish."

  demo = {
    title: "Beneath your&nbsp;<br/><strong>browser</strong>…"
  }

  footer = {
    year: new Date().getFullYear(),
    twitterUrl: "https://twitter.com/getonbeam",
    twitter: "Twitter",
    aboutUrl: "https://angel.co/company/beam-app-1",
    about: "About",
    jobsUrl: "https://angel.co/company/beam-app-1/jobs",
    jobs: "Jobs",
    whyUrl: "https://public.beamapp.co/beam/note/c5ef3f23-5864-45ad-943e-b75b093555e1/Bright-Paper",
    why: "Why beam?"
  }

  tabs = {
    journal: "Journal",
    allNotes: "Toutes les notes",
    note: "Note",
    bmail: "Bienvenue sur beam ! - bmail",
    beamTimes: "The beam Times - Actualités",
    youtube: "You On Kazoo! - YouTube"
  }

  journal = {
    today: {
      title: "Aujourd'hui",
      line1: "Support du markdown",
      line2: "Liens bidirectionnels",
      line3: "Chiffré de bout en bout",
      line4: "Organisé autour de votre journal",
    },
    yesterday: {
      title: "Hier",
      line1: "⌘K pour chercher sur le web et dans vos notes",
      line2: "⌘D pour basculer entre le web et vos notes",
      line3: "Appuyez sur ⌥ & cliquez pour capturer du contenu web"
    }
  }

  note = {
    title: "Note",
    publish: {
      error: "Error",
      publish: "Publish",
      publishing: "Publishing...",
      published: "Published!",
      unpublish: "",
      unpublishing: "",
      unpublished: "",
      url_copied: "URL copied"
    }
  }

  animation = {
    titles: [
      "A <br><strong class=\"in\">powerful note</strong> app…",
      "So you can <br><strong class=\"in\">capture</strong> the web…",
      "Make it <br><strong class=\"in\">your own</strong>…",
      "And <strong class=\"in\">share it</strong> <br>with the world",
      "<strong class=\"in\">Sign up</strong> <br>for the beta now <span class=\"arrow\">-&gt;</span>",
    ]
  }
}

class HomePage extends Page {
  constructor() {
    super(
      {
        en: new HomeMessages_en(),
        fr: new HomeMessages_fr()
      },
      "index.html",
      ["index", "home"]
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
