const process = require('process')
const FeatureFlagsClient = require('./src/util/FeatureFlagsClient')
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
    ogImage: `${process.env.CANONICAL_HOST}/social/unfurl.jpg`,
    ogDescription: "Browse. Capture. Write. Publish – Coming soon to macOS. Join the beta now.",
    twitterSite: "getonbeam",
    twitterTitle: "Meet the bright web – beam",
    twitterImage: `${process.env.CANONICAL_HOST}/social/unfurl.jpg`
  }

  header = {
    betaSignup: "Sign up for beta",
    betaSignupPlaceholder: "Enter your e-mail address...",
    betaSignupError: "We couldn't save your email, please try again",
    betaSignupSuccess: "Got it! We'll be in touch shortly",
    tryBeam: "Try Beam",
  }

  title = "Meet the bright web"
  subtitle = "Browse.  Capture.  Write.  Publish."
  download = "Download"
  downloadSuccess = "Enjoy!"
  macOSVerion = "for macOS 12.3"

  demo = {
    title: "Beneath your&nbsp;<br/><strong class=\"in\">browser</strong>…"
  }

  footer = {
    year: new Date().getFullYear(),
    social: [
      {
        name: "Twitter",
        url: "https://twitter.com/getonbeam",
        icon: `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.1911 3.877C13.8124 3.75236 14.4734 3.52112 15 3.20304C15 4.25565 14.7962 5.10192 13.9293 5.73985C14.102 9.64546 11.242 14 6.17965 14C4.64024 14 3.2066 13.5403 2 12.7525C3.44637 12.9262 4.89053 12.5173 6.03678 11.6019C4.84291 11.5794 3.83621 10.7768 3.48957 9.67366C3.91706 9.75713 4.33735 9.73231 4.72109 9.62628C3.40983 9.35839 2.50446 8.15484 2.53436 6.86839C2.90149 7.0765 3.32234 7.20114 3.76865 7.2158C2.55485 6.389 2.21098 4.75625 2.9253 3.50815C4.27034 5.18827 6.27932 6.29368 8.54468 6.4093C8.14709 4.67278 9.44063 3 11.201 3C11.9851 3 12.6944 3.33726 13.1911 3.877Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
      },
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/company/beam-app",
        icon: `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.25 3.75C2.25 2.92157 2.92157 2.25 3.75 2.25H13.25C14.0784 2.25 14.75 2.92157 14.75 3.75V13.25C14.75 14.0784 14.0784 14.75 13.25 14.75H3.75C2.92157 14.75 2.25 14.0784 2.25 13.25V3.75Z" stroke="currentColor" stroke-width="1.5"/>
<path d="M9.02887 7.88507L9.1805 7.92342L9.18073 7.92354L9.18076 7.92349L9.18081 7.9234L9.18155 7.92208L9.1851 7.91588C9.18841 7.91022 9.19358 7.90157 9.20065 7.89037C9.21482 7.86797 9.23659 7.83539 9.26629 7.79603C9.32575 7.71721 9.41663 7.61168 9.54148 7.5061C9.79057 7.29545 10.1747 7.08454 10.7177 7.08454C11.2669 7.08454 11.7295 7.2519 12.0548 7.58425C12.3802 7.91664 12.5781 8.42404 12.5781 9.12326V12.4192H11.0959V9.70032C11.0959 9.30846 11.0219 8.98937 10.8585 8.76644C10.692 8.53912 10.441 8.42296 10.1159 8.42296C9.7659 8.42296 9.48954 8.54208 9.30254 8.7694C9.11758 8.99424 9.02887 9.31424 9.02887 9.70032V12.4192H7.60637V7.24748H9.02887V7.88507ZM5.47688 6.38748C4.9825 6.38748 4.58087 5.98357 4.58087 5.48414C4.58087 4.9847 4.9825 4.58079 5.47688 4.58079C5.97123 4.58079 6.37263 4.98468 6.37263 5.48414C6.37263 5.9836 5.97123 6.38748 5.47688 6.38748ZM6.22992 7.24745V12.4191H4.73972V7.24745H6.22992Z" fill="currentColor" stroke="currentColor" stroke-width="0.161615"/>
</svg>`
      },
      {
        name: "Slack",
        url: "https://beambeta.slack.com/",
        icon: `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.45156 10.35C4.45156 11.1637 3.79444 11.8213 2.9814 11.8213C2.16835 11.8213 1.51123 11.1637 1.51123 10.35C1.51123 9.5363 2.16835 8.87866 2.9814 8.87866H4.45156V10.35ZM5.18664 10.35C5.18664 9.5363 5.84376 8.87866 6.65681 8.87866C7.46985 8.87866 8.12697 9.5363 8.12697 10.35V14.0283C8.12697 14.842 7.46985 15.4997 6.65681 15.4997C5.84376 15.4997 5.18664 14.842 5.18664 14.0283V10.35Z" fill="currentColor"/>
<path d="M6.65671 4.44267C5.84367 4.44267 5.18655 3.78503 5.18655 2.97134C5.18655 2.15764 5.84367 1.5 6.65671 1.5C7.46976 1.5 8.12688 2.15764 8.12688 2.97134V4.44267H6.65671ZM6.65671 5.18949C7.46976 5.18949 8.12688 5.84713 8.12688 6.66082C8.12688 7.47451 7.46976 8.13216 6.65671 8.13216H2.97017C2.15712 8.13216 1.5 7.47451 1.5 6.66082C1.5 5.84713 2.15712 5.18949 2.97017 5.18949H6.65671Z" fill="currentColor"/>
<path d="M12.5489 6.66082C12.5489 5.84713 13.2061 5.18949 14.0191 5.18949C14.8322 5.18949 15.4893 5.84713 15.4893 6.66082C15.4893 7.47451 14.8322 8.13216 14.0191 8.13216H12.5489V6.66082ZM11.8139 6.66082C11.8139 7.47451 11.1567 8.13216 10.3437 8.13216C9.53065 8.13216 8.87354 7.47451 8.87354 6.66082V2.97134C8.87354 2.15764 9.53065 1.5 10.3437 1.5C11.1567 1.5 11.8139 2.15764 11.8139 2.97134V6.66082Z" fill="currentColor"/>
<path d="M10.3437 12.557C11.1567 12.557 11.8139 13.2146 11.8139 14.0283C11.8139 14.842 11.1567 15.4997 10.3437 15.4997C9.53065 15.4997 8.87354 14.842 8.87354 14.0283V12.557H10.3437ZM10.3437 11.8213C9.53065 11.8213 8.87354 11.1637 8.87354 10.35C8.87354 9.5363 9.53065 8.87866 10.3437 8.87866H14.0302C14.8433 8.87866 15.5004 9.5363 15.5004 10.35C15.5004 11.1637 14.8433 11.8213 14.0302 11.8213H10.3437Z" fill="currentColor"/>
</svg>`,
      },
    ],
    jobsUrl: "https://angel.co/company/beam-app-1/jobs",
    jobs: "Jobs",
    whyUrl: "https://public.beamapp.co/beam/note/c5ef3f23-5864-45ad-943e-b75b093555e1/Bright-Paper",
    why: "Why beam?",
    supportUrl: "https://beamapp.canny.io",
    support: "Support",
    privacyPolicyUrl: "https://beamapp.co/privacy",
    privacyPolicy: "Privacy policy",
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
      FeatureFlagsClient.isEnabled("download beta app")
        ? "<button class=\"beam-button large download-app\" data-from=\"prototype\">Download beam</button>"
        : "<strong class=\"in\">Sign up</strong> <br>for the beta now <span class=\"arrow\">-&gt;</span>"
    ]
  }
}

class HomeMessages_fr {
  metas = {
    title: "Bienvenue sur beam",
    description: "Browse. Capture. Write. Publish – Meet the bright web",
    ogTitle: "Meet the bright web – beam",
    ogUrl: process.env.CANONICAL_HOST,
    ogImage: `${process.env.CANONICAL_HOST}/social/unfurl.jpg`,
    ogDescription: "Browse. Capture. Write. Publish – Coming soon to macOS. Join the beta now.",
    twitterSite: "getonbeam",
    twitterTitle: "Meet the bright web – beam",
    twitterImage: `${process.env.CANONICAL_HOST}/social/unfurl.jpg`
  }

  header = {
    betaSignup: "Sign up for beta",
    betaSignupPlaceholder: "Enter your e-mail address...",
    betaSignupError: "We couldn't save your email, please try again",
    betaSignupSuccess: "Got it! We'll be in touch shortly",
    tryBeam: "Try Beam",
  }

  title = "Meet the bright web"
  subtitle = "Browse.  Capture.  Write.  Publish."
  download = "Download"
  downloadSuccess = "Enjoy!"
  macOSVerion = "for macOS 12.3"

  demo = {
    title: "Beneath your&nbsp;<br/><strong>browser</strong>…"
  }

  footer = {
    year: new Date().getFullYear(),
    social: [
      {
        name: "Twitter",
        url: "https://twitter.com/getonbeam",
        icon: `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.1911 3.877C13.8124 3.75236 14.4734 3.52112 15 3.20304C15 4.25565 14.7962 5.10192 13.9293 5.73985C14.102 9.64546 11.242 14 6.17965 14C4.64024 14 3.2066 13.5403 2 12.7525C3.44637 12.9262 4.89053 12.5173 6.03678 11.6019C4.84291 11.5794 3.83621 10.7768 3.48957 9.67366C3.91706 9.75713 4.33735 9.73231 4.72109 9.62628C3.40983 9.35839 2.50446 8.15484 2.53436 6.86839C2.90149 7.0765 3.32234 7.20114 3.76865 7.2158C2.55485 6.389 2.21098 4.75625 2.9253 3.50815C4.27034 5.18827 6.27932 6.29368 8.54468 6.4093C8.14709 4.67278 9.44063 3 11.201 3C11.9851 3 12.6944 3.33726 13.1911 3.877Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
      },
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/company/beam-app",
        icon: `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.25 3.75C2.25 2.92157 2.92157 2.25 3.75 2.25H13.25C14.0784 2.25 14.75 2.92157 14.75 3.75V13.25C14.75 14.0784 14.0784 14.75 13.25 14.75H3.75C2.92157 14.75 2.25 14.0784 2.25 13.25V3.75Z" stroke="currentColor" stroke-width="1.5"/>
<path d="M9.02887 7.88507L9.1805 7.92342L9.18073 7.92354L9.18076 7.92349L9.18081 7.9234L9.18155 7.92208L9.1851 7.91588C9.18841 7.91022 9.19358 7.90157 9.20065 7.89037C9.21482 7.86797 9.23659 7.83539 9.26629 7.79603C9.32575 7.71721 9.41663 7.61168 9.54148 7.5061C9.79057 7.29545 10.1747 7.08454 10.7177 7.08454C11.2669 7.08454 11.7295 7.2519 12.0548 7.58425C12.3802 7.91664 12.5781 8.42404 12.5781 9.12326V12.4192H11.0959V9.70032C11.0959 9.30846 11.0219 8.98937 10.8585 8.76644C10.692 8.53912 10.441 8.42296 10.1159 8.42296C9.7659 8.42296 9.48954 8.54208 9.30254 8.7694C9.11758 8.99424 9.02887 9.31424 9.02887 9.70032V12.4192H7.60637V7.24748H9.02887V7.88507ZM5.47688 6.38748C4.9825 6.38748 4.58087 5.98357 4.58087 5.48414C4.58087 4.9847 4.9825 4.58079 5.47688 4.58079C5.97123 4.58079 6.37263 4.98468 6.37263 5.48414C6.37263 5.9836 5.97123 6.38748 5.47688 6.38748ZM6.22992 7.24745V12.4191H4.73972V7.24745H6.22992Z" fill="currentColor" stroke="currentColor" stroke-width="0.161615"/>
</svg>`
      },
      {
        name: "Slack",
        url: "https://beambeta.slack.com/",
        icon: `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.45156 10.35C4.45156 11.1637 3.79444 11.8213 2.9814 11.8213C2.16835 11.8213 1.51123 11.1637 1.51123 10.35C1.51123 9.5363 2.16835 8.87866 2.9814 8.87866H4.45156V10.35ZM5.18664 10.35C5.18664 9.5363 5.84376 8.87866 6.65681 8.87866C7.46985 8.87866 8.12697 9.5363 8.12697 10.35V14.0283C8.12697 14.842 7.46985 15.4997 6.65681 15.4997C5.84376 15.4997 5.18664 14.842 5.18664 14.0283V10.35Z" fill="currentColor"/>
<path d="M6.65671 4.44267C5.84367 4.44267 5.18655 3.78503 5.18655 2.97134C5.18655 2.15764 5.84367 1.5 6.65671 1.5C7.46976 1.5 8.12688 2.15764 8.12688 2.97134V4.44267H6.65671ZM6.65671 5.18949C7.46976 5.18949 8.12688 5.84713 8.12688 6.66082C8.12688 7.47451 7.46976 8.13216 6.65671 8.13216H2.97017C2.15712 8.13216 1.5 7.47451 1.5 6.66082C1.5 5.84713 2.15712 5.18949 2.97017 5.18949H6.65671Z" fill="currentColor"/>
<path d="M12.5489 6.66082C12.5489 5.84713 13.2061 5.18949 14.0191 5.18949C14.8322 5.18949 15.4893 5.84713 15.4893 6.66082C15.4893 7.47451 14.8322 8.13216 14.0191 8.13216H12.5489V6.66082ZM11.8139 6.66082C11.8139 7.47451 11.1567 8.13216 10.3437 8.13216C9.53065 8.13216 8.87354 7.47451 8.87354 6.66082V2.97134C8.87354 2.15764 9.53065 1.5 10.3437 1.5C11.1567 1.5 11.8139 2.15764 11.8139 2.97134V6.66082Z" fill="currentColor"/>
<path d="M10.3437 12.557C11.1567 12.557 11.8139 13.2146 11.8139 14.0283C11.8139 14.842 11.1567 15.4997 10.3437 15.4997C9.53065 15.4997 8.87354 14.842 8.87354 14.0283V12.557H10.3437ZM10.3437 11.8213C9.53065 11.8213 8.87354 11.1637 8.87354 10.35C8.87354 9.5363 9.53065 8.87866 10.3437 8.87866H14.0302C14.8433 8.87866 15.5004 9.5363 15.5004 10.35C15.5004 11.1637 14.8433 11.8213 14.0302 11.8213H10.3437Z" fill="currentColor"/>
</svg>`,
      },
    ],
    jobsUrl: "https://angel.co/company/beam-app-1/jobs",
    jobs: "Jobs",
    whyUrl: "https://public.beamapp.co/beam/note/c5ef3f23-5864-45ad-943e-b75b093555e1/Bright-Paper",
    why: "Why beam?",
    supportUrl: "https://beamapp.canny.io",
    support: "Support",
    privacyPolicyUrl: "https://beamapp.co/privacy",
    privacyPolicy: "Privacy policy",
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
      FeatureFlagsClient.isEnabled("download beta app")
        ? "<button class=\"beam-button large download-app\" data-from=\"prototype\">Download beam</button>"
        : "<strong class=\"in\">Sign up</strong> <br>for the beta now <span class=\"arrow\">-&gt;</span>"
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
