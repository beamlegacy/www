import {html} from "util/html/Html"
import {HtmlUtils} from "util/html/HtmlUtils"

export interface RevealButton extends HTMLButtonElement {
  icon: Element | null

  label: string | null

  open: boolean

  content: string | HTMLElement

  element?: HTMLButtonElement

  new(): any

  render(): void

  restoreFocus(): void
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export class IconWithLabelRevealButton extends window.HTMLButtonElement implements RevealButton {
  element?: HTMLButtonElement

  private labelWidth = 0

  private hovering = false

  private isFocused = false

  private labelElem?: HTMLElement

  private iconElem?: HTMLElement

  private isVisible = false

  private _open = false

  private _icon: Element | null = null

  private _label = ""

  constructor() {
    super()
    this.handleBlur = this.handleBlur.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
  }

  get open(): boolean {
    return this._open
  }

  set open(value: boolean) {
    this._open = value
    if (this._open) {
      this.classList.add("active")
    } else {
      this.blur()
      this.classList.remove("active")
      this.close()
    }
  }

  get icon(): Element | null {
    return this._icon
  }

  set icon(icon: Element | null) {
    this._icon = icon
    if (!this.iconElem) {
      this.iconElem = html`<span class="icon"/>` as HTMLElement
    } else {
      this.iconElem.innerHTML = ""
    }
    if (this._icon) {
      this.iconElem.appendChild(this._icon)
    }
    if (this._icon && this._label) {
      this.render()
    }
  }

  get label(): string {
    return this._label
  }

  set label(label: string | null) {
    this._label = label ? label : ""
    if (!this.labelElem) {
      this.labelElem = html`<span class="label" tabindex="-1"/>` as HTMLElement
    }
    this.labelElem.textContent = this._label
    if (this._icon && this._label) {
      this.render()
      if (this.isVisible) {
        this.measureLabel()
        this.updateVariables()
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  connectedCallback(): void {
    setTimeout(() => {
      this.addEventListener("blur", this.handleBlur)
      this.addEventListener("focus", this.handleFocus)
      this.addEventListener("mouseleave", this.handleMouseLeave)
      this.addEventListener("mouseenter", this.handleMouseEnter)
      if (this.children) {
        const icon = this.querySelector(".icon")
        if (icon && icon.firstElementChild && icon.firstElementChild !== this.icon) {
          this.icon = icon.firstElementChild
        }
        const label = this.querySelector(".label")
        if (label && label.textContent !== this.label) {
          this.label = label.textContent
        }
      }
    })

    const callback = (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        this.isVisible = entry.isIntersecting
        if (this.isVisible) {
          this.measureLabel()
          this.updateVariables()
        }
      }
    }
    const intersectionObserver = new IntersectionObserver(callback)
    intersectionObserver.observe(this)
  }

  render(): void {
    console.assert(this._icon, "IconWithLabelRevealButton should have an icon property, set it using: `buttonInstance.icon = yourIconHTMLElement`")
    console.assert(this._label, "IconWithLabelRevealButton should have a label property, set it using: `buttonInstance.label = yourLabelString`")
    this.classList.add("icon-with-label-reveal-button")
    if (this._open) {
      this.classList.add("active")
    } else {
      this.classList.remove("active")
    }
    this.innerHTML = ""
    this.appendChild(html`${this.iconElem}${this.labelElem}` as HTMLElement)
  }

  restoreFocus(): void {
    if (this.isFocused) {
      this.focus()
    }
  }

  private close(): void {
    if (!this._open && !this.hovering && !this.isFocused) {
      this.labelWidth = 0
      this.updateVariables()
      this.classList.remove("active")
    }
  }

  private measureLabel(): void {
    const span = html`<span class="icon-with-label-reveal-button-label">&nbsp;${this.label}</span>` as HTMLElement
    const dimensions = HtmlUtils.measureHtmlElement(span)
    this.labelWidth = dimensions.width + 1 // + 1 for safari, of course...
  }

  private updateVariables(): void {
    this.style.setProperty("--label-width", `${this.labelWidth}px`)
  }

  private handleBlur(e: FocusEvent): void {
    const relatedTarget = e.relatedTarget as HTMLElement
    // Make sure we don't close when giving focus to a text copy-container
    if (!relatedTarget || !relatedTarget.classList.contains("copy-container")) {
      this.isFocused = false
      this.close()
    }
  }

  private handleFocus(): void {
    this.isFocused = true
    this.measureLabel()
    this.updateVariables()
  }

  private handleMouseLeave(): void {
    this.hovering = false
    // give focus back to the element, since we are de facto giving focus upon copying to clipboard
    // we need to give it back before we can trigger blur()
    this.focus()
    this.blur()
  }

  private handleMouseEnter(): void {
    this.hovering = true
    this.focus()
  }
}
