import "./index.scss"
import {Cookie} from "util/cookie/Cookie"
import {LocalizedPage, pages} from "../pages"

class App {
  supportedLang = ["en", "fr"]
  defaultLang = "en"
  lang = "en"

  constructor() {
    this.initLang()
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
      const url = this.lang === this.defaultLang ? this.removeUrlPrefix(page.url) : page.url
      if (location.pathname.replace(/\/$/, "") !== url) {
        window.location.replace(url)
      }
    }
  }

  get langUrlPrefix(): string {
    return `/${this.lang}`
  }

  removeUrlPrefix(url: string): string {
    return url.replace(
      new RegExp(
        `^${this.langUrlPrefix.replace(/([/])/, "\\$1")}`, "g"
      ),
      ""
    )
  }

  private getCurrentPage(): LocalizedPage<any> | undefined {
    // Try to find page with current url and lang
    let page = pages.find(p => {
      const pSlug = this.removeUrlPrefix(p.url)
      const url = location.pathname.replace(/\/$/, "")
      console.log({pUrl: p.url, pSlug, url})
      return p.lang === this.lang && pSlug === url
    })

    if (!page) {
      // Try to get the page using url only and then finding its lang equivalent
      const currentPage = pages.find(p => p.url === location.pathname.replace(/\/$/, ""))
      if (currentPage) {
        page = pages.find(p => p.lang === this.lang && p.page === currentPage.page)
      }
    }
    console.assert(page)
    return page
  }
}

new App()