import {BeamWindow} from "home/beam-window/BeamWindow"

export class BetaSignupForm {

  private requestPending = false

  constructor(public element: Element, private messages: any, private offsetElement?: Element) {
    this.initEventListeners()
  }

  get betaSignup(): Element | null {
    return this.element
  }

  get betaSignupForm(): Element | null {
    return this.element.querySelector(":scope form")
  }

  get betaSignupButton(): Element | null {
    return this.element.querySelector(":scope > button")
  }

  get betaSignupCloseButton(): Element | null {
    return this.element.querySelector(":scope .input button.button-close")
  }

  get betaSignupSubmitButton(): Element | null {
    return this.element.querySelector(":scope .input button.button-arrow")
  }

  get betaSignupInputContainer(): Element | null {
    return this.element.querySelector(":scope .input")
  }

  get betaSignupInput(): Element | null {
    return this.element.querySelector(":scope input")
  }

  get betaSignupOutput(): Element | null {
    return this.element.querySelector(":scope .output")
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

  private handleSignupButtonClick = (_e: Event): void => {
    const input = this.betaSignupInput as HTMLInputElement
    input?.focus()
  }

  private handleSignupInputFocus = (_e: FocusEvent): void => {
    const betaSignup = this.betaSignup as HTMLElement
    betaSignup?.classList.add("show-input")
    betaSignup?.classList.remove("show-output")
    this.offsetElement?.classList.add("out")
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
        this.offsetElement?.classList.remove("out")
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