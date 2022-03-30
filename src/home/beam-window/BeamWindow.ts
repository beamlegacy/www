import "./beam-window.scss"

export enum BeamWindowMode {
  web = "web",
  writing = "writing"
}

export type BeamThemedFavicon = {
  light: string,
  dark: string
}

export type BeamTab = {
  url?: string,
  beamUrl: string,
  label: string,
  icon?: string | BeamThemedFavicon
}

export type ToggleModeHandler = (mode: BeamWindowMode) => void

export type ToggleTabHandler = () => void

const defaultOmnbiboxIcon = {
  light: "data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 10 10' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg %3E%3Cpath d='M1.40625 4.6875C1.14737 4.6875 0.9375 4.89737 0.9375 5.15625C0.9375 5.41513 1.14737 5.625 1.40625 5.625V4.6875ZM8.59375 5.15625L8.92521 5.48771C9.10826 5.30465 9.10826 5.00785 8.92521 4.82479L8.59375 5.15625ZM6.42521 2.32479C6.24215 2.14174 5.94535 2.14174 5.76229 2.32479C5.57924 2.50785 5.57924 2.80465 5.76229 2.98771L6.42521 2.32479ZM5.76229 7.32479C5.57924 7.50785 5.57924 7.80465 5.76229 7.98771C5.94535 8.17076 6.24215 8.17076 6.42521 7.98771L5.76229 7.32479ZM1.40625 5.625H8.59375V4.6875H1.40625V5.625ZM8.92521 4.82479L6.42521 2.32479L5.76229 2.98771L8.26229 5.48771L8.92521 4.82479ZM8.26229 4.82479L5.76229 7.32479L6.42521 7.98771L8.92521 5.48771L8.26229 4.82479Z' fill='%23A6A8AB'/%3E%3C/g%3E%3C/svg%3E%0A",
  dark: "data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 10 10' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg %3E%3Cpath d='M1.40625 4.6875C1.14737 4.6875 0.9375 4.89737 0.9375 5.15625C0.9375 5.41513 1.14737 5.625 1.40625 5.625V4.6875ZM8.59375 5.15625L8.92521 5.48771C9.10826 5.30465 9.10826 5.00785 8.92521 4.82479L8.59375 5.15625ZM6.42521 2.32479C6.24215 2.14174 5.94535 2.14174 5.76229 2.32479C5.57924 2.50785 5.57924 2.80465 5.76229 2.98771L6.42521 2.32479ZM5.76229 7.32479C5.57924 7.50785 5.57924 7.80465 5.76229 7.98771C5.94535 8.17076 6.24215 8.17076 6.42521 7.98771L5.76229 7.32479ZM1.40625 5.625H8.59375V4.6875H1.40625V5.625ZM8.92521 4.82479L6.42521 2.32479L5.76229 2.98771L8.26229 5.48771L8.92521 4.82479ZM8.26229 4.82479L5.76229 7.32479L6.42521 7.98771L8.92521 5.48771L8.26229 4.82479Z' fill='%23737373'/%3E%3C/g%3E%3C/svg%3E%0A"
}

export class BeamWindow extends HTMLElement {
  private controls: Element | null = null
  private content: Element | null = null
  private window: Element | null = null
  private newModeHandler: ToggleModeHandler | undefined = undefined
  private tabClickHandler: ToggleTabHandler | undefined = undefined

  constructor() {
    super()
  }

  static get observedAttributes(): string[] {
    return ["start-url"]
  }

  /**
   * Get the current window mode
   */
  get mode(): BeamWindowMode {
    let mode = BeamWindowMode.web
    if (this.window?.classList.contains(BeamWindowMode.writing)) {
      mode = BeamWindowMode.writing
    }
    return mode
  }

  /**
   * Set the current window mode and run `newModeHandler` callback set using BeamWindowInstance.onToggleMode
   * @see BeamWindow.onNewMode
   * @param newMode
   */
  set mode(newMode: BeamWindowMode) {
    const commonBeforeHandler = () => {
      const selector = this.tabsContainerSelector
      const inactiveTabs = this.window?.querySelectorAll(`:not(${selector}) > .tab`) as NodeListOf<HTMLButtonElement>
      const activeTabs = this.window?.querySelectorAll(`${selector} > .tab`) as NodeListOf<HTMLButtonElement>
      const updateButtonsDisabledAttr =
        (disabled: boolean, enabledTabIndex = 0) => (button: HTMLButtonElement) => {
          button.tabIndex = disabled ? -1 : enabledTabIndex
          button.disabled = disabled
        }
      inactiveTabs.forEach(updateButtonsDisabledAttr(true))
      activeTabs.forEach(updateButtonsDisabledAttr(false))
    }
    if (this.mode !== newMode) {
      this.window?.classList.remove(BeamWindowMode.web, BeamWindowMode.writing)
      this.window?.classList.add(newMode)
      commonBeforeHandler()
      this.newModeHandler && this.newModeHandler(newMode)
    } else {
      commonBeforeHandler()
    }
  }

  /**
   * Get the current url, in the form mode/page
   */
  get url(): string {
    const currentPage = this.window?.querySelector(
      `.content ${this.mode === BeamWindowMode.writing ? ".writing" : ""} > .current`
    ) as HTMLElement
    return `${this.mode}/${currentPage?.dataset.page}`
  }

  /**
   * Set the current url and update the window accordingly
   * @param newUrl
   */
  set url(newUrl: string) {
    const [mode, page] = newUrl.split("/")
    const tab = this.window?.querySelector(
      `.tab[data-page=${page}]`
    ) as HTMLButtonElement
    if (tab) {
      this.mode = mode as BeamWindowMode
      tab.click()
      const tabs = this.window?.querySelector(".tabs") as HTMLElement
      tabs.scrollTop = 0
    }
  }

  /**
   * Get current tabs css selector
   */
  get tabsContainerSelector(): string {
    const isWriting = this.mode === BeamWindowMode.writing
    return isWriting ? ".tabs-writing" : ".tabs"
  }

  /**
   * Get current content container css selector
   */
  get containerSelector(): string {
    const isWriting = this.mode === BeamWindowMode.writing
    return isWriting ? ".content .writing" : ".content"
  }

  /**
   * Return the current capture target css selector (relative to the current "web page")
   */
  get captureTargetSelector(): string | undefined {
    const highlight = this.window?.querySelector(".capture-frame .highlight") as HTMLElement
    return highlight?.dataset.highlighting
  }

  connectedCallback(): void {
    this.content = this.querySelector(".content")
    this.controls = this.querySelector("header .controls")
    this.window = this.querySelector(".beam-window")
    this.initEventListeners()
    const tabsNodeList = this.window?.querySelectorAll(".tab") as NodeListOf<HTMLElement>
    if (tabsNodeList) {
      const tabs = Array.from(tabsNodeList)
      const beamTabs = tabs.map(t => this.tabFromElement(t))
      this.renderOmniboxResults(beamTabs)
    }
    const url = this.getAttribute("start-url")
    if (url) {
      this.url = url
    }
  }

  /**
   * Toggle between modes
   */
  toggleMode = (): void => {
    this.mode = this.mode === BeamWindowMode.web ? BeamWindowMode.writing : BeamWindowMode.web
  }

  /**
   * Set the callback to be run after a new window mode was set
   * @param handler
   */
  onNewMode = (handler: (mode: BeamWindowMode) => void | undefined): void => {
    if (handler) {
      this.newModeHandler = handler
    }
  }

  /**
   * Toggle open / close the omnibox
   */
  toggleOmnibox = (): void => {
    this.window?.classList.toggle("open-omnibox")
    if (this.window?.classList.contains("open-omnibox")) {
      const input = this.window?.querySelector(".omnibox-frame .omnibox input") as HTMLInputElement
      setTimeout(() => {
        input.focus()
        input.select()
      })
    }
  }

  /**
   * Set the callback to be run after a tab was clicked
   * @param handler
   */
  onTabClick = (handler: () => void | undefined): void => {
    if (handler) {
      this.tabClickHandler = handler
    }
  }

  /**
   * Point to the element matching the given css `selector` (relative to the current "web page"),
   * Reset to default state in no selector is given
   * @param selector
   */
  captureTarget = (selector?: string): void => {
    this.window?.classList.remove("open-omnibox")
    const highlight = this.content?.querySelector(".capture-frame .highlight") as HTMLElement
    highlight?.classList.remove("shoot")
    this.window?.classList.remove("capturing")
    delete highlight.dataset.highlighting
    if (selector && this.content) {
      const elem = this.getShootTarget(selector)
      highlight.dataset.highlighting = selector
      if (elem) {
        this.window?.classList.add("capturing")
        if (highlight) {
          highlight.style.setProperty("--x", `${elem.offsetLeft}px`)
          highlight.style.setProperty("--y", `${elem.offsetTop}px`)
          highlight.style.setProperty("--width", `${elem.offsetWidth}px`)
          highlight.style.setProperty("--height", `${elem.offsetHeight}px`)
        }
      }
    } else {
      this.window?.classList.remove("capturing")
      if (highlight) {
        delete highlight.dataset.highlighting
        highlight.style.setProperty("--x", "50%")
        highlight.style.setProperty("--y", "50%")
        highlight.style.setProperty("--width", "0")
        highlight.style.setProperty("--height", "0")
      }
    }
  }

  /**
   * Shoot current capture element and add it to the journal
   */
  shoot = (): void => {
    if (this.content) {
      const highlight = this.content.querySelector(".capture-frame .highlight") as HTMLElement
      const selector = highlight.dataset.highlighting
      if (selector) {
        const target = this.getShootTarget(selector)
        if (target) {
          highlight?.classList.add("shoot")
          const noteContent = this.querySelector(".journal .view li:first-child ul")
          const firstLi = noteContent?.querySelector("li:first-child") ?? null
          const newLi = document.createElement("li")
          newLi.classList.add("insert")
          const isImg = target.classList.contains("img")
          if (isImg) {
            newLi.classList.add("media")
          }
          newLi.append(...(isImg ? [target.cloneNode(true)] : Array.from(target.children).map(c => c.cloneNode(true))))
          noteContent?.insertBefore(newLi, firstLi)
        }
      }
    }
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    switch (name) {
      case "start-url":
        this.url = newValue
        break
    }
  }

  private initEventListeners = (): void => {
    const switcher = this.controls?.querySelector(".switcher")
    switcher?.removeEventListener("click", this.toggleMode)
    switcher?.addEventListener("click", this.toggleMode)
    const search = this.controls?.querySelector(".search")
    search?.removeEventListener("click", this.toggleOmnibox)
    search?.addEventListener("click", this.toggleOmnibox)
    const tabs = this.querySelectorAll(".tab") as NodeListOf<HTMLElement>
    tabs.forEach(tab => {
      const tabEl = tab as HTMLElement
      tabEl.removeEventListener("click", this.handleTabClick)
      tabEl.addEventListener("click", this.handleTabClick)
    })
    this.window?.removeEventListener("click", this.handleBeamWindowClick)
    this.window?.addEventListener("click", this.handleBeamWindowClick)
    this.window?.removeEventListener("blur", this.handleBeamWindowBlur, true)
    this.window?.addEventListener("blur", this.handleBeamWindowBlur, true)
    this.window?.removeEventListener("animationend", this.handleAnimationEnd)
    this.window?.addEventListener("animationend", this.handleAnimationEnd)
    const omnibox = this.window?.querySelector(".omnibox")
    const input = omnibox?.querySelector("input")
    omnibox?.removeEventListener("keydown", this.handleOmniboxKeydown)
    omnibox?.addEventListener("keydown", this.handleOmniboxKeydown)
    omnibox?.removeEventListener("blur", this.handleOmniboxBlur, true)
    omnibox?.addEventListener("blur", this.handleOmniboxBlur, true)
    input?.removeEventListener("input", this.handleOmniboxInput)
    input?.addEventListener("input", this.handleOmniboxInput)
    this.window?.removeEventListener("mousedown", this.handleButtonMouseDown, true)
    this.window?.addEventListener("mousedown", this.handleButtonMouseDown, true)
  }

  /**
   * Update omnibox results based on current input
   * @param e
   */
  private handleOmniboxInput = (e: Event): void => {
    const target = e.target as HTMLInputElement
    const tabs = Array.from(this.window?.querySelectorAll(".tab") as NodeListOf<HTMLElement>)
    const query = target.value.toLowerCase()
    const result = tabs.map((tab: HTMLElement): BeamTab | undefined => {
      const entry = this.tabFromElement(tab)
      return this.omniboxTabMatcher(entry, query) ? entry : undefined
    }).filter(Boolean) as BeamTab[]
    if (query.replace(/[^a-z]/g, "").match(/^beammeup/)) {
      result.push({label: "Download beam beta 😎", beamUrl: "https://s3.eu-west-3.amazonaws.com/downloads.beamapp.co/beta/Beam.dmg", icon: defaultOmnbiboxIcon})
    }
    this.renderOmniboxResults(result)
  }

  /**
   * Get a BeamTab from html markup
   * @param tab
   */
  private tabFromElement = (tab: HTMLElement): BeamTab => {
    const url = tab.querySelector(".url")?.textContent ?? undefined
    const beamUrl = `${url ? "web" : "writing"}/${tab.dataset.page}`
    const label = tab.querySelector(".label")?.textContent ?? tab.textContent ?? ""
    const icons = tab.querySelectorAll(".favicon") as NodeListOf<HTMLImageElement>
    const icon = icons.length === 1
      ? icons[0].src
      : icons.length === 0
        ? defaultOmnbiboxIcon
        : {light: icons[0]?.src ?? "", dark: icons[1]?.src ?? ""}
    const entry: BeamTab = {url, beamUrl, label, icon}
    return entry
  }

  /**
   * Returns whether a tab matches the given string input
   * @param tab
   * @param str
   */
  private omniboxTabMatcher = (tab: BeamTab, str: string): boolean => {
    let match
    if (str) {
      match = tab.label.toLocaleLowerCase().indexOf(str) >= 0
    } else {
      match = true
    }
    return match
  }

  /**
   * Render the omnibox results in the DOM
   * @param results
   */
  private renderOmniboxResults = (results: BeamTab[]) => {
    const previousRows = this.window?.querySelectorAll(".omnibox .row:not(:first-child)") as NodeListOf<HTMLElement>
    previousRows.forEach(r => r.remove())
    results.forEach(result => {
      const row = this.renderOmniboxResult(result)
      row.addEventListener("click", (e: Event): void => {
        this.url = result.beamUrl
        const target = e.target as HTMLElement
        setTimeout(() => target.blur())
      })
      this.window?.querySelector(".omnibox-frame .omnibox")?.appendChild(row)
    })
  }

  /**
   * Return rendered omnibox result, ready for DOM insertion
   * @param result
   */
  private renderOmniboxResult = (result: BeamTab): HTMLElement => {
    const link = result.beamUrl.startsWith("http")
    const row = document.createElement(link ? "a" : "button")
    if (link) {
      row.setAttribute("href", result.beamUrl)
    }
    row.classList.add("row", "result")
    row.tabIndex = 0
    const icon = document.createElement("div")
    icon.classList.add("icon")
    row.appendChild(icon)
    const img = document.createElement("img") as HTMLImageElement
    img.alt = ""
    const favicon = result.icon
    if (favicon) {
      const isThemed = favicon && typeof favicon !== "string"
      img.src = isThemed ? (favicon as BeamThemedFavicon).light : favicon
      img.width = 10
      img.height = 10
      icon.appendChild(img)
      if (isThemed && favicon.dark) {
        img.classList.add("light-only")
        const img2 = document.createElement("img") as HTMLImageElement
        img2.src = favicon.dark
        img2.alt = ""
        img2.classList.add("dark-only")
        img2.width = 10
        img2.height = 10
        icon.appendChild(img2)
      }
    }
    const content = document.createElement("div")
    content.classList.add("content")
    content.appendChild(document.createTextNode(result.label))
    row.appendChild(content)
    return row
  }

  /**
   * Close omnibox when blurring if necessary (based on relatedTarget)
   * @param e
   */
  private handleOmniboxBlur = (e: Event): void => {
    const ev = e as FocusEvent
    const relatedTarget = ev.relatedTarget as HTMLElement
    const search = this.controls?.querySelector(".search")
    const omnibox = this.window?.querySelector(".omnibox-frame .omnibox")
    if (!search?.contains(relatedTarget) && !omnibox?.contains(relatedTarget)) {
      this.window?.classList.remove("open-omnibox")
    }
  }

  /**
   * Respond to keydown on omnibox - TODO
   * @param e
   */
  private handleOmniboxKeydown = (e: Event): void => {
    const ev = e as KeyboardEvent
    if (ev.key.toLowerCase() === "escape") {
      this.window?.classList.remove("open-omnibox")
      const omniboxInput = this.window?.querySelector(".omnibox-frame .omnibox input") as HTMLInputElement
      omniboxInput?.blur()
    }
  }

  /**
   * Respond to captured blur events on BeamWindow,
   * this is our chance to reset .clicked elements
   * @param e
   */
  private handleBeamWindowBlur = (e: Event): void => {
    const evt = e as FocusEvent
    if (evt.target !== evt.relatedTarget) {
      this.resetClicked()
    }
  }

  /**
   * Respond to captured click events on BeamWindow:
   * - close the omnibox if necessary (depending on which element was clicked)
   * - deal with buttons for safari and to keep track of the clicked one,
   * @param e
   */
  private handleBeamWindowClick = (e: Event): void => {
    this.resetClicked()
    const targetEl = e.target as HTMLElement
    if (targetEl instanceof HTMLButtonElement) {
      targetEl.focus()
      targetEl.classList.add("clicked")
    }
    const search = this.controls?.querySelector(".search")
    const omnibox = this.window?.querySelector(".omnibox-frame .omnibox")
    if (!search?.contains(targetEl) && !omnibox?.contains(targetEl)) {
      this.window?.classList.remove("open-omnibox")
    }
  }

  /**
   * Remove the .clicked class we have to use to be able to maintain focus
   * and keyboard navigation active, while also styling the way we want
   */
  private resetClicked = (): void => {
    const clicked = this.window?.querySelectorAll(".clicked") as NodeListOf<HTMLElement>
    clicked.forEach(c => c.classList.remove("clicked"))
  }

  /**
   * Respond to AnimationEnd events on BeamWindow, the nested events bubble up,
   * effectively responding to any nested animation too
   * @param e
   * @private
   */
  private handleAnimationEnd(e: Event): void {
    const ev = e as AnimationEvent
    const target = ev.target as HTMLElement
    switch (ev.animationName) {
      case "beam-window-placeholder-in": {
        let insertEl = target
        if (!target.classList.contains("insert") && target.parentElement) {
          insertEl = target.parentElement
        }
        insertEl.classList.remove("insert")
        break
      }
    }
  }

  /**
   * Respond to tab click and run callback set via `onTabClick`
   * @param e
   */
  private handleTabClick = (e: MouseEvent): void => {
    const tab = e.currentTarget as HTMLElement
    const allSeparators = tab.parentElement?.querySelectorAll(".separator") as NodeListOf<HTMLElement>
    allSeparators.forEach(s => s.classList.remove("next-tab-is-current"))
    const separator = tab.previousElementSibling?.classList.contains("separator") && tab.previousElementSibling
    if (separator instanceof HTMLElement) {
      separator.classList.add("next-tab-is-current")
    }
    const containerSelector = this.containerSelector
    const tabContainerSelector = this.tabsContainerSelector
    const page = tab.dataset.page
    if (page) {
      const target = this.querySelector(`${containerSelector} > [data-page=${page}]`)
      if (target) {
        this.querySelector(`${containerSelector} > .current`)?.classList.remove("current")
        this.querySelector(`${tabContainerSelector} > .current`)?.classList.remove("current")
        target.classList.add("current")
        tab.classList.add("current")
      }
    }
    this.tabClickHandler && this.tabClickHandler()
  }

  /**
   * Get the matching shoot target given a css selector (relative to the current "web page")
   * @param selector
   */
  getShootTarget = (selector: string = this.captureTargetSelector ?? ""): HTMLElement | null => {
    return this.content?.querySelector(`*:not(.writing) > .current ${selector}`) ?? null
  }

  /**
   * Safari and co forces us to do some chores manually like setting focus to buttons when clicked
   * @param e
   * @private
   */
  private handleButtonMouseDown(e: Event): void {
    if (e.target instanceof HTMLButtonElement) {
      e.target.focus()
    }
  }
}