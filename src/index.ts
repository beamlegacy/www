import "./index.scss"
import "@ungap/custom-elements"
import {Cookie} from "util/cookie/Cookie"
import {BeamWindow} from "home/beam-window/BeamWindow"
import {MOTD} from "util/MOTD"
import {BetaSignupForm} from "widget/BetaSignupForm"
import packageJson from "../package.json"
import {GoogleAnalytics} from "util/GoogleAnalytics"
import DownloadApp from "util/DownloadApp"

const {version} = packageJson
const pages = require("../pages.js")

interface LocalizedPage {
  messages: any
  url: string
}

export default class App {
  supportedLang = ["en", "fr"]
  defaultLang = "en"
  lang = "en"
  private messages: any

  constructor() {
    MOTD({version})
    window.customElements.get("beam-window") || window.customElements.define("beam-window", BeamWindow)
    this.messages = (window as any).messages
    this.initLang()
    this.sizeVh()
    this.initEventListeners()
    this.initLogoLink()
    const form = document.querySelector(".beta-signup")
    if (form) {
      new BetaSignupForm(form, this.messages, this.logo ?? undefined)
    }
  }

  get langUrlPrefix(): string {
    return `/${this.lang}`
  }

  get logo(): Element | null {
    return document.querySelector(".beam-logo")
  }

  private sizeVh(): void {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty("--vh", `${vh}px`)
  }

  private removeUrlPrefix(url: string): string {
    return url.replace(
      new RegExp(
        `^${this.langUrlPrefix.replace(/([/])/, "\\$1")}`, "g"
      ),
      ""
    )
  }

  private initLang(): void {
    const lang = Cookie.get("nf_lang")
    if (lang) {
      this.lang = lang
    } else {
      const navLang = navigator.language
      const langMatcher = (l: string): boolean => !!navLang.match(new RegExp(`^${l}(-.*)?$`))
      this.lang = this.supportedLang.find(langMatcher) ?? this.defaultLang
    }
    // Redirect if necessary
    const page = this.getCurrentPage()
    if (page) {
      this.messages = page.messages
      const url = this.lang === this.defaultLang ? this.removeUrlPrefix(page.url) : page.url
      if (location.pathname.replace(/\/$/, "") !== url) {
        window.location.replace(url)
      }
    }
  }

  private initEventListeners = (): void => {
    window.addEventListener("resize", this.sizeVh)
    window.addEventListener("scroll", this.sizeVh)
    window.visualViewport?.addEventListener("resize", this.sizeVh)
    window.addEventListener("load", () => {
      setTimeout(() => document.body.classList.remove("loading"))
    })
  }

  private getCurrentPage(): LocalizedPage | undefined {
    // Try to find page with current url and lang
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    let page = pages.find(p => {
      const pSlug = this.removeUrlPrefix(p.url)
      const url = location.pathname.replace(/\/$/, "")
      return p.lang === this.lang && pSlug === url
    })

    if (!page) {
      // Try to get the page using url only and then finding its lang equivalent
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const currentPage = pages.find(p => p.url === location.pathname.replace(/\/$/, ""))
      if (currentPage) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        page = pages.find(p => p.lang === this.lang && p.page === currentPage.page)
      }
    }
    console.assert(page)
    return page
  }

  private initLogoLink() {
    const logo = this.logo
    const beta = logo?.querySelector(".beta")
    beta?.addEventListener("dblclick", () => {
      GoogleAnalytics.trackEvent("app_download")
      window.location.replace(DownloadApp.getUrl())
    })
  }
}

new App()