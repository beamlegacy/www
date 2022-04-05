import {BeamWindow, BeamWindowMode} from "home/beam-window/BeamWindow"
import {BeamWindowAnimation} from "home/BeamWindowAnimation"
import {NumberUtil} from "util/NumberUtil"
import {IconWithLabelRevealButton, RevealButton} from "home/beam-window/widget/button/IconWithLabelRevealButton"
import {PublishButton} from "home/beam-window/widget/button/PublishButton"
import {BetaSignupForm} from "widget/BetaSignupForm"

// If you want to debug the animation / timeouts of this module, set this to true
const debug = false

export class Homepage {
  private observer: IntersectionObserver | undefined
  animation: BeamWindowAnimation
  private timeout: ReturnType<typeof setTimeout> | undefined
  readonly win: BeamWindow
  private footerObserver: IntersectionObserver | undefined
  private publishButtons: PublishButton[] = []
  private bumpWithDelay = true

  constructor() {
    window.customElements.get("beam-button-reveal") || window.customElements.define("beam-button-reveal", IconWithLabelRevealButton, {extends: "button"})

    this.animation = new BeamWindowAnimation(this.handleNewMode, this.clearTimeout, this.handleLastTitleClick)
    this.win = document.querySelector("beam-window") as BeamWindow

    this.initPublishButtons()
    this.initSearch()
    this.initMainObserver()
    this.initFooterObserver()
  }

  get demo(): HTMLElement | null {
    return document.querySelector(".demo")
  }

  get footer(): HTMLElement | null {
    return document.querySelector(".beam-site > footer")
  }

  get title(): HTMLElement | null {
    return document.querySelector(".demo .title")
  }

  get hero(): HTMLElement | null {
    return document.querySelector(".hero")
  }

  get titleContainer(): HTMLElement | null {
    return document.querySelector(".title-container")
  }

  private handleNewMode = (newMode: BeamWindowMode): void => {
    if (newMode === BeamWindowMode.web) {
      this.resetPublishButtons()
    }
  }

  private resetPublishButtons = (): void => {
    const writing = this.win.querySelector(".content .writing") as HTMLElement
    const transitionEnd = () => {
      this.publishButtons.forEach(p => p.reset())
      writing.removeEventListener("transitionend", transitionEnd)
      writing.removeEventListener("transitioncancel", transitionCancel)
    }
    const transitionCancel = () => {
      writing.removeEventListener("transitionend", transitionEnd)
      writing.removeEventListener("transitioncancel", transitionCancel)
    }
    writing.addEventListener("transitionend", transitionEnd)
    writing.addEventListener("transitioncancel", transitionCancel)
  }

  protected initFooterObserver(): void {
    const footer = this.footer
    if (footer) {
      this.footerObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
        const ratio = entries[0].intersectionRatio
        const mapped = NumberUtil.map(ratio, 0, 1)
        const content = footer.querySelector(".content") as HTMLElement
        content?.style.setProperty("transform", `scale(${mapped})`)
        content?.style.setProperty("opacity", `${mapped}`)
      }, {
        rootMargin: "0px 0px -25px 0px",
        threshold: new Array(1000).fill(0).map((v, i) => (i + 1) / 1000)
      })
      this.footerObserver.observe(footer)
    }
  }

  protected initMainObserver(): void {
    const demo = this.demo
    if (demo) {
      this.observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
        const ratio = entries[0].intersectionRatio
        const min = 0.4
        const max = 0.8
        const titleMin = 0.5

        const mappedRatio = NumberUtil.map(ratio, min, max)
        this.updateHero(1 - mappedRatio)

        if (ratio <= 0.9) {
          this.animation.playing = false
          this.clearTimeout()
          this.resetAnimation(false)
        }

        if (mappedRatio === 1) {
          this.handleFullyVisible()
        } else if (mappedRatio === 0) {
          this.handleFullyOut()
        }

        const mappedRatio2 = NumberUtil.map(ratio, titleMin, max, 0, 1)
        this.updateTitleContainer(mappedRatio2)

        const mappedRatio3 = entries[0].intersectionRatio
        const r = (mappedRatio3 <= 0.5 ? mappedRatio3 : 1 - mappedRatio3) * 2
        const adjusted = Math.sqrt(r < 0.5 ? (r * 2) ** 2 * 0.5 : r)
        document.body.style.setProperty("--gradient-opacity", `${0.2 + adjusted * 0.2}`)
        document.body.style.setProperty("--gradient-grow", `${adjusted * 0.35 * 100}%`)

        const mappedRatio4 = NumberUtil.map(ratio, 0.25, 0.65)
        this.updateWin(mappedRatio4)
      }, {
        rootMargin: "0px 0px -100px 0px",
        threshold: new Array(1000).fill(0).map((v, i) => (i + 1) / 1000)
      })
      this.observer.observe(demo)
    }
  }

  protected initSearch(): void{
    const search = this.win.querySelector(".controls .search") as HTMLButtonElement
    search?.addEventListener("click", this.stopAnimations)
  }

  protected initPublishButtons(): void {
    const buttons = this.win.querySelectorAll("[is=beam-button-reveal]") as unknown as NodeListOf<RevealButton>
    const messages = (window as any).messages
    this.publishButtons = Array.from(buttons).map((b: RevealButton): PublishButton => {
      const publishButton = new PublishButton(messages.note.publish, b, false, this.stepAfterPublish)
      publishButton.render()
      const publishHandler = publishButton.getPublishHandler()
      b.addEventListener("click", publishHandler)
      return publishButton
    })
  }

  private handleFullyVisible = (): void => {
    this.clearTimeout()
    this.animation.playing = true
    const title = this.title
    title?.style.setProperty("opacity", "1")
    title?.classList.add("in")
    const strong = title?.querySelector("strong")
    strong?.classList.add("in")
    switch (this.animation.switches) {
      case 0:
        this.timeout = setTimeout(this.step2, 1350)
        break
      case 1:
        this.timeout = setTimeout(this.step3, 1350)
        break
      default:
        this.timeout = setTimeout(this.step4, 1350)
        break
    }
  }

  private handleFullyOut = (): void => {
    const {win, demo} = this
    this.resetAnimation()
    win.mode = BeamWindowMode.web
    let title = this.title
    if (title) {
      const messages = (window as any).messages
      const msg = messages.demo.title
      this.animation.changeTitle(msg, true)
      title = demo?.querySelector(".title") as HTMLElement
      title.classList.remove("in")
      title.style.setProperty("--animation-slide-in-transform", "translateY(4em)")
      const strong = title?.querySelector("strong")
      strong?.classList.remove("in")
      title.style.setProperty("opacity", "0")
    }
    this.resetPublishButtons()
  }

  private step2 = (): void => {
    debug && console.log("Home - Step 2", {switches: this.animation.switches})
    const win = this.win
    this.animation.changeTitle(this.animation.titles[Math.min(this.animation.switches, this.animation.titles.length - 1)])
    this.timeout = setTimeout(() => {
      win.url = "writing/journal"
      this.timeout = setTimeout(this.step3, 2000)
    }, 1350)
  }

  private step3 = (): void => {
    debug && console.log("Home - Step 3", {switches: this.animation.switches})
    const win = this.win
    if (win.mode === BeamWindowMode.writing) {
      this.animation.changeTitle(this.animation.titles[Math.min(this.animation.switches, this.animation.titles.length - 1)])
      this.timeout = setTimeout(() => {
        win.mode = BeamWindowMode.web
      }, 1350)
    }
  }

  private step4 = (): void => {
    debug && console.log("Home - Step 4", {switches: this.animation.switches})
    const win = this.win
    if (this.animation.switches < 3) {
      this.timeout = setTimeout(() => {
        win.toggleMode()
        win.url = "writing/journal"
        this.animation.switches--
      }, 1350)
    }
  }

  private stepAfterPublish = (): void => {
    debug && console.log("Home - After publish step", {switches: this.animation.switches})
    this.timeout = setTimeout(() => {
      const title = this.animation.titles[Math.min(this.animation.switches, this.animation.titles.length - 1)]
      this.animation.changeTitle(title)
    }, 2350)
  }

  private clearTimeout = (): void => {
    this.timeout && clearTimeout(this.timeout)
  }

  private updateHero(t: number): void {
    const hero = this.hero
    hero?.style.setProperty("opacity", `${t}`)
    hero?.style.setProperty("transform", `scale(${t})`)
  }

  private updateTitleContainer(t: number): void {
    const titleContainer = this.titleContainer
    titleContainer?.style.setProperty("opacity", `${t}`)
    titleContainer?.style.setProperty("transform", `translateY(${10 * (1 - t)}em)`)
  }

  private updateWin(t: number): void {
    const bumpThreshold = 0.35
    const w = this.win?.querySelector(".beam-window") as HTMLElement
    w?.style.setProperty("--transform", `scale(${0.9 + NumberUtil.map(t, 0.375, 1) * 0.1})`)
    w?.style.setProperty("animation", t <= bumpThreshold ? `bump 0.5s ease-in-out${this.bumpWithDelay ? " 0.5s" : ""}` : "")
    if (t <= bumpThreshold) {
      this.bumpWithDelay = false
    }
  }

  private resetAnimation(resetSwitches = true): void {
    this.animation.cancelAnimation()
    this.animation.rotateBack()
    this.win.captureTarget()
    if (resetSwitches) {
      this.animation.switches = 0
    }
  }

  private stopAnimations = (): void => {
    this.clearTimeout()
    this.animation.cancelAnimation()
  }

  private handleLastTitleClick = (e: MouseEvent) => {
    const target = e.currentTarget as HTMLElement
    if (target) {
      const form = target.querySelector("form")
      // wrap and clone form if not already there
      if (!form || form.tagName.toLowerCase() !== "form") {
        const cloned = document.querySelector(".beta-signup form")?.cloneNode(true)
        if (cloned) {
          const button = document.createElement("div")
          button.classList.add("button")
          button.append(...Array.from(target.childNodes))
          const output = document.createElement("div")
          output.classList.add("output")
          target.append(button, cloned, output)
          new BetaSignupForm(target, (window as any).messages)
          target.classList.add("beta-signup")
        }
      }
    }
  }
}