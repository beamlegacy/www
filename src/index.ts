import "./index.scss"
import {Cookie} from "util/cookie/Cookie"
import {BeamWindow} from "home/beam-window/BeamWindow"
import {BeamWindowAnimation} from "home/BeamWindowAnimation"
const pages = require("../pages.js")

interface LocalizedPage {
  url: string
}

class App {
  supportedLang = ["en", "fr"]
  defaultLang = "en"
  lang = "en"

  constructor() {
    this.initLang()
    window.customElements.define("beam-window", BeamWindow)
    const betaSignup = document.querySelector(".beta-signup") as HTMLElement
    const betaSignupButton = betaSignup?.querySelector(":scope > button") as HTMLButtonElement
    const closeButton = betaSignup?.querySelector(":scope .input button.button-close") as HTMLButtonElement
    const betaSignupInputContainer = betaSignup?.querySelector(":scope .input") as HTMLButtonElement
    const input = betaSignupInputContainer.querySelector("input") as HTMLInputElement
    betaSignupButton?.addEventListener("click", () => {
      betaSignup?.classList.add("show-input")
      input?.focus()
    })
    closeButton?.addEventListener("click", () => {
      betaSignup?.classList.remove("show-input")
    })
    betaSignupInputContainer?.addEventListener("blur", (e: FocusEvent) => {
      const related = e.relatedTarget as HTMLElement
      if (!e.relatedTarget || !betaSignupInputContainer.contains(related)) {
        const windows = document.querySelectorAll("beam-window") as NodeListOf<BeamWindow>
        const inWindow = Array.from(windows).some(w => w.contains(related))
        if (inWindow && related.tagName.toLowerCase() !== "input") {
          betaSignupButton.click()
        } else {
          betaSignup?.classList.remove("show-input")
        }
      }
    }, true)
    input.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement
      if (target.checkValidity()) {
        betaSignup.classList.add("valid")
      } else {
        betaSignup.classList.remove("valid")
      }
    })

    this.sizeVh()
    window.addEventListener("resize", this.sizeVh)
    window.addEventListener("scroll", this.sizeVh)
    window.visualViewport.addEventListener("resize", this.sizeVh)
  }

  private sizeVh() {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty("--vh", `${vh}px`)
  }

  private sendEmailToBeamApi = (email: string): Promise<void> => {
    return fetch("https://api.beamapp.co/api/v1/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({email})
    })
      .then((response: Response) => {
        /**/
      })
      .catch((error) => {
        /**/
      })
  }

  private generateSecureSubscribeLink = (email: string): Promise<string | void> => {
    return fetch("https://createsend.com//t/getsecuresubscribelink", {
      method: "POST",
      body: new URLSearchParams({
        email: email,
        data: "2BE4EF332AA2E32596E38B640E90561943B7209F892F8B9FEEDA29EC0ADCD1A97FB4D140E71DAED8BD8055A91B5C943EF17A6DA263A0A43CA53C175E28C9C6CF"
      }),
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      }
    })
      .then((response: Response) => {
        return response.text()
      })
      .catch((error) => {
        /**/
      })
  }

  private sendEmailToCreateSend = (secureUrl: string, email: string): Promise<void> => {
    return fetch(secureUrl, {
      method: "POST",
      body: new URLSearchParams({
        "cm-ykdjjuh-ykdjjuh": email
      }),
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      }
    })
      .then((response) => {
        /**/
      })
      .catch((error) =>{
        /**/
      })
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

  private getCurrentPage(): LocalizedPage | undefined {
    // Try to find page with current url and lang
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    let page = pages.find(p => {
      const pSlug = this.removeUrlPrefix(p.url)
      const url = location.pathname.replace(/\/$/, "")
      console.log({pUrl: p.url, pSlug, url})
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
}

new App()