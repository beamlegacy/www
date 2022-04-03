import "./index.scss"
import "@ungap/custom-elements"
import {Cookie} from "util/cookie/Cookie"
import {BeamWindow} from "home/beam-window/BeamWindow"

const pages = require("../pages.js")

interface LocalizedPage {
  url: string
}

export default class App {
  supportedLang = ["en", "fr"]
  defaultLang = "en"
  lang = "en"
  private messages: any
  private requestPending = false

  constructor() {
    window.customElements.get("beam-window") || window.customElements.define("beam-window", BeamWindow)
    this.messages = (window as any).messages
    this.initLang()
    this.sizeVh()
    this.initEventListeners()
    this.initLogoLink()
  }

  get langUrlPrefix(): string {
    return `/${this.lang}`
  }

  get logo(): Element | null {
    return document.querySelector(".beam-logo")
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

  get betaSignupSubmitButton(): Element | null {
    return document.querySelector(".beta-signup .input button.button-arrow")
  }

  get betaSignupInputContainer(): Element | null {
    return document.querySelector(".beta-signup .input")
  }

  get betaSignupInput(): Element | null {
    return document.querySelector(".beta-signup input")
  }

  get betaSignupOutput(): Element | null {
    return document.querySelector(".beta-signup .output")
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
    const token = process.env.SECURE_SUBSCRIBE_TOKEN || ""
    console.assert(url, "No SUBSCRIBE_LINK_URL found in env")
    console.assert(token, "No SECURE_SUBSCRIBE_TOKEN found in env")
    return fetch(url, {
      method: "POST",
      body: new URLSearchParams({
        email: email,
        data: token
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
    const key = process.env.SUBSCRIBE_EMAIL_KEY || "email"
    return fetch(secureUrl, {
      method: "POST",
      body: new URLSearchParams({
        [key]: email
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
    const submitButton = this.betaSignupSubmitButton as HTMLButtonElement
    const betaSignupButton = this.betaSignupButton as HTMLButtonElement
    const closeButton = this.betaSignupCloseButton as HTMLButtonElement
    const betaSignupInputContainer = this.betaSignupInputContainer as HTMLElement
    const input = this.betaSignupInput as HTMLInputElement
    const form = this.betaSignupForm as HTMLFormElement
    submitButton?.addEventListener("mousedown", this.forceFocus)
    betaSignupButton?.addEventListener("click", this.handleSignupButtonClick)
    closeButton?.addEventListener("click", this.handleSignupCloseButtonClick)
    betaSignupInputContainer?.addEventListener("blur", this.handleSignupInputContainerBlur, true)
    input?.addEventListener("input", this.handleSignupInput)
    input?.addEventListener("focus", this.handleSignupInputFocus)
    input?.addEventListener("keydown", this.handleBetaSignupKeydown)
    form?.addEventListener("submit", this.handleBetaSignupFormSubmit)
    window.addEventListener("resize", this.sizeVh)
    window.addEventListener("scroll", this.sizeVh)
    window.visualViewport?.addEventListener("resize", this.sizeVh)
  }

  private handleSignupButtonClick = (_e: Event): void => {
    const input = this.betaSignupInput as HTMLInputElement
    input?.focus()
  }

  private handleSignupInputFocus = (_e: FocusEvent): void => {
    const betaSignup = this.betaSignup as HTMLElement
    betaSignup?.classList.add("show-input")
    betaSignup?.classList.remove("show-output")
    this.logo?.classList.add("out")
  }

  private handleSignupCloseButtonClick = (e: Event): void => {
    e.preventDefault()
    const betaSignup = this.betaSignup as HTMLElement
    betaSignup?.classList.remove("pending")
    const target = document.activeElement as HTMLElement
    target?.blur()
  }

  private handleSignupInputContainerBlur = (e: FocusEvent): void => {
    const related = e.relatedTarget as HTMLElement
    const betaSignupInputContainer = this.betaSignupInputContainer as HTMLButtonElement
    if (!related || !betaSignupInputContainer.contains(related)) {
      const windows = document.querySelectorAll("beam-window") as NodeListOf<BeamWindow>
      const inWindow = Array.from(windows).some(w => w.contains(related))
      if (inWindow && related.tagName.toLowerCase() !== "input") {
        const betaSignupButton = this.betaSignupButton as HTMLButtonElement
        betaSignupButton.click()
      } else {
        const betaSignup = this.betaSignup
        betaSignup?.classList.remove("show-input")
        betaSignup?.classList.remove("show-output")
        this.logo?.classList.remove("out")
      }
    }
  }

  private handleSignupInput = (e: Event): void => {
    const target = e.target as HTMLInputElement
    const betaSignup = this.betaSignup
    const betaSubmit = this.betaSignupSubmitButton as HTMLButtonElement
    const betaClose = this.betaSignupCloseButton as HTMLButtonElement
    if (target.checkValidity()) {
      betaSignup?.classList.add("valid")
      betaSubmit.disabled = false
      betaClose.disabled = true
    } else {
      betaSignup?.classList.remove("valid")
      betaSubmit.disabled = true
      betaClose.disabled = false
    }
  }

  private handleBetaSignupKeydown = (e: Event): void => {
    const ev = e as KeyboardEvent
    const input = this.betaSignupInput as HTMLInputElement
    if (ev.key.toLowerCase() === "escape") {
      input?.blur()
    } else if (ev.key.toLowerCase() === "enter" && !input.checkValidity()) {
      const betaSignup = this.betaSignup as HTMLElement
      betaSignup?.classList.remove("error", "pending")
      betaSignup?.offsetTop
      betaSignup?.classList.add("error")
    }
  }

  private handleBetaSignupFormSubmit = async (e: Event): Promise<void> => {
    e.preventDefault()
    const form = e.currentTarget as HTMLFormElement
    const betaSignup = this.betaSignup as HTMLElement
    if (!this.requestPending) {
      if (form.checkValidity()) {
        betaSignup?.classList.remove("error")
        await this.sendRequest(betaSignup, form)
      } else {
        betaSignup?.classList.remove("error", "pending")
        betaSignup?.offsetTop
        betaSignup?.classList.add("error")
      }
    }
  }

  private async sendRequest(betaSignup: HTMLElement, form: HTMLFormElement): Promise<void> {
    this.requestPending = true
    betaSignup.classList.add("pending")
    const email = form.elements.namedItem("zXmAeBqfd") as HTMLInputElement
    const output = this.betaSignupOutput as HTMLElement
    console.assert(email)
    if (email.checkValidity()) {
      this.sendEmailToBeamApi(email.value) // this one can fail without it being an issue, and we don't need to await it
      try {
        const url = await this.generateSecureSubscribeLink(email.value)
        if (url) {
          await this.sendEmailToCreateSend(url, email.value)
          this.renderSuccess(output)
        } else {
          throw new Error("No secure subscribe url was returned")
        }
      } catch (_err) {
        this.renderError(output)
      } finally {
        betaSignup?.classList.remove("pending", "show-input")
        betaSignup?.classList.add("show-output")

        setTimeout(() => {
          betaSignup?.classList.remove("show-output")
          this.requestPending = false
          const active = document.activeElement as HTMLElement
          if (form && form.contains(active)) {
            active.blur()
          }
        }, 2500)
      }
    }
  }

  private renderError(output: HTMLElement): void {
    const icon = `<svg class="icn error" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3L13 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M13 3L3 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`
    output.innerHTML = `${icon}<small>${this.messages.header.betaSignupError}</small>`
  }

  private renderSuccess(output: HTMLElement): void {
    const icon = `<svg class="icn checkmark" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 7.5L6.5 12.5L13.5 2.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`
    output.innerHTML = `${icon}<small>${this.messages.header.betaSignupSuccess}</small>`
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
      window.location.replace("https://s3.eu-west-3.amazonaws.com/downloads.beamapp.co/beta/Beam.dmg")
    })
  }

  /**
   * Force focus on elements that have a tabIndex attribute
   * (this is done for browsers like safari which don't give focus to button by default)
   */
  private forceFocus = (e: MouseEvent): void => {
    const target = e.target as HTMLElement
    if (target.tabIndex || target.tabIndex === 0) {
      e.preventDefault()
      target.focus()
    }
  }
}

new App()