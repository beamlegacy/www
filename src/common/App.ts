import {Cookie} from "util/cookie/Cookie"
import {MOTD} from "util/MOTD"
import packageJson from "./../../package.json"
import {GoogleAnalytics} from "util/GoogleAnalytics"
import DownloadApp from "util/DownloadApp"

import {Header} from "component/layout/Header"
import {Footer} from "component/layout/Footer"

import {Home} from "page/Home"
import {About} from "page/About"

const {version} = packageJson
const pages = require("./../../pages.js")

const launchers: any = {
  "Home": Home,
  "About": About
}

interface LocalizedPage {
  lang: string,
  messages: any
  url: string
  page: any
}

export default class App {
  supportedLang = ["en", "fr"]
  defaultLang = "en"
  lang = "en"

  private messages: any
  private page: any

  public header: Header = new Header()
  public footer: Footer = new Footer()

  constructor(motd:boolean = true) {
    if (motd === true) MOTD({version})

    this.messages = (window as any).messages
    this.initPage()
    this.sizeVh()
    this.initEventListeners()
    this.initLogoLink()
    this.initDownloadButtons()
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

  private initPage(): void {
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

      // Load page class
      if (launchers[page.page.launcher]) {
        this.page = new launchers[page.page.launcher]()
        this.page.setApp(this)
        this.page.init()
      }
    }
  }

  private initEventListeners = (): void => {
    window.addEventListener("resize", this.sizeVh)
    window.addEventListener("scroll", this.sizeVh)
    window.visualViewport?.addEventListener("resize", this.sizeVh)
    window.addEventListener("load", () => {
      setTimeout(() => document.body.classList.remove("loading"))
      const elSite = document.querySelector(".beam-site") as HTMLElement
      elSite.style.removeProperty("opacity")
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
    beta?.addEventListener("click", (event) => {
      event.preventDefault()
    })
    beta?.addEventListener("dblclick", () => {
      GoogleAnalytics.trackEvent("app_download", {from: "beta_logo"})
      DownloadApp.startDownload()
    })
  }

  private handleDownload(button: Element): void {
    const from = button.getAttribute("data-from") as string
    DownloadApp.startDownload()
    GoogleAnalytics.trackEvent("app_download", {from})

    if (from === "header") {
      return
    }

    button.classList.add("link", "no-pointer-events")
    button.classList.remove("pulse-on-load")
    button.setAttribute("data-cta", button.textContent as string)
    button.textContent = this.messages.downloadSuccess

    setTimeout(() => {
      button.classList.remove("link", "no-pointer-events")
      button.textContent = button.getAttribute("data-cta")
    }, 2000)
  }

  private initDownloadButtons() {
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement
      if (target.classList.contains("download-app")) {
        this.handleDownload(target)
      }
    })
  }
}
