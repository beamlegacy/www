import "./index.scss"
import {Cookie} from "util/cookie/Cookie"
import {BeamWindow} from "home/beam-window/BeamWindow"

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
    this.sizeVh()
    window.customElements.define("beam-window", BeamWindow)
    this.initEventListeners()
  }

  get langUrlPrefix(): string {
    return `/${this.lang}`
  }

  get betaSignup(): Element | null {
    return document.querySelector(".beta-signup")
  }

  get betaSignupForm(): Element | null {
    return document.querySelector(".beta-signup form")
  }

  get betaSignupButton(): Element | null {
    return document.querySelector(".beta-signup > button")
  }

  get betaSignupCloseButton(): Element | null {
    return document.querySelector(".beta-signup .input button.button-close")
  }

  get betaSignupInputContainer(): Element | null {
    return document.querySelector(".beta-signup .input")
  }

  get betaSignupInput(): Element | null {
    return document.querySelector(".beta-signup input")
  }

  private sizeVh(): void {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty("--vh", `${vh}px`)
  }

  private sendEmailToBeamApi = (email: string): Promise<void> => {
    const url = process.env.API_HOST || ""
    console.assert(url, "No API_HOST found in env")
    return fetch(`${url}/api/v1/emails`, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({email})
    })
      .then((_response: Response) => {
        /**/
      })
      .catch((error) => {
        throw error
      })
  }

  private generateSecureSubscribeLink = (email: string): Promise<string | void> => {
    const url = process.env.SUBSCRIBE_LINK_URL || ""
    console.assert(url, "No SUBSCRIBE_LINK_URL found in env")
    return fetch(url, {
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
        throw error
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
      .then((_response) => {
        /**/
      })
      .catch((error) => {
        throw error
      })
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
      const url = this.lang === this.defaultLang ? this.removeUrlPrefix(page.url) : page.url
      if (location.pathname.replace(/\/$/, "") !== url) {
        window.location.replace(url)
      }
    }
  }

  private initEventListeners = (): void => {
    const betaSignupButton = this.betaSignupButton as HTMLButtonElement
    const closeButton = this.betaSignupCloseButton as HTMLButtonElement
    const betaSignupInputContainer = this.betaSignupInputContainer as HTMLElement
    const input = this.betaSignupInput as HTMLInputElement
    const form = this.betaSignupForm as HTMLFormElement
    betaSignupButton?.addEventListener("click", this.handleSignupButtonClick)
    closeButton?.addEventListener("click", this.handleSignupCloseButtonClick)
    betaSignupInputContainer?.addEventListener("blur", this.handleSignupInputContainerBlur, true)
    input?.addEventListener("input", this.handleSignupInput)
    input?.addEventListener("keydown", this.handleBetaSignupKeydown)
    form.addEventListener("submit", this.handleBetaSignupFormSubmit)
    window.addEventListener("resize", this.sizeVh)
    window.addEventListener("scroll", this.sizeVh)
    window.visualViewport.addEventListener("resize", this.sizeVh)
  }

  private handleSignupButtonClick = (_e: Event): void => {
    const betaSignup = this.betaSignup as HTMLElement
    const input = this.betaSignupInput as HTMLInputElement
    betaSignup?.classList.add("show-input")
    input?.focus()
  }

  private handleSignupCloseButtonClick = (_e: Event): void => {
    const betaSignup = this.betaSignup as HTMLElement
    betaSignup?.classList.remove("show-input")
    betaSignup?.classList.remove("pending")
  }

  private handleSignupInputContainerBlur = (e: FocusEvent): void => {
    const related = e.relatedTarget as HTMLElement
    const betaSignupInputContainer = this.betaSignupInputContainer as HTMLButtonElement
    if (!e.relatedTarget || !betaSignupInputContainer.contains(related)) {
      const windows = document.querySelectorAll("beam-window") as NodeListOf<BeamWindow>
      const inWindow = Array.from(windows).some(w => w.contains(related))
      if (inWindow && related.tagName.toLowerCase() !== "input") {
        const betaSignupButton = this.betaSignupButton as HTMLButtonElement
        betaSignupButton.click()
      } else {
        const betaSignup = this.betaSignup
        betaSignup?.classList.remove("show-input")
      }
    }
  }

  private handleSignupInput = (e: Event): void => {
    const target = e.target as HTMLInputElement
    const betaSignup = this.betaSignup
    if (target.checkValidity()) {
      betaSignup?.classList.add("valid")
    } else {
      betaSignup?.classList.remove("valid")
    }
  }

  private handleBetaSignupKeydown = (e: Event): void => {
    const ev = e as KeyboardEvent
    if (ev.key.toLowerCase() === "escape") {
      const betaSignup = document.querySelector(".beta-signup") as HTMLElement
      const betaSignupInputContainer = betaSignup?.querySelector(":scope .input") as HTMLButtonElement
      const input = betaSignupInputContainer.querySelector("input") as HTMLInputElement
      input?.blur()
    }
  }

  private handleBetaSignupFormSubmit = async (e: Event): Promise<void> => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const betaSignup = document.querySelector(".beta-signup") as HTMLElement
    if (form.checkValidity()) {
      betaSignup?.classList.remove("error")
      betaSignup.classList.add("pending")
      const email = form.elements.namedItem("zXmAeBqfd") as HTMLInputElement
      console.assert(email)
      if (email) {
        this.sendEmailToBeamApi(email.value)
        const url = await this.generateSecureSubscribeLink(email.value)
        console.assert(url)
        if (url) {
          await this.sendEmailToCreateSend(url, email.value)
          betaSignup?.classList.remove("pending")
          betaSignup?.classList.remove("show-input")
        }
      }
    } else {
      betaSignup?.classList.remove("error")
      betaSignup?.classList.remove("pending")
      betaSignup?.offsetTop
      betaSignup?.classList.add("error")
    }
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