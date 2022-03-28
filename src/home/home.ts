import {BeamWindow, BeamWindowMode} from "home/beam-window/BeamWindow"
import {BeamWindowAnimation} from "home/BeamWindowAnimation"
import {NumberUtil} from "util/NumberUtil"

export class Homepage {
  private observer: IntersectionObserver | undefined
  private animation: BeamWindowAnimation
  private timeout: ReturnType<typeof setTimeout> | undefined
  private readonly win: BeamWindow
  private footerObserver: IntersectionObserver | undefined

  constructor() {
    this.animation = new BeamWindowAnimation()
    const demo = this.demo
    this.win = document.querySelector("beam-window") as BeamWindow
    if (demo) {
      this.observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
        const ratio = entries[0].intersectionRatio
        const min = 0.4
        const max = 0.8
        const titleMin = 0.5

        const mappedRatio = NumberUtil.map(ratio, min, max)
        this.updateHero(1 - mappedRatio)

        if (ratio <= 0.9) {
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
        rootMargin: "0px 0px -25px 0px",
        threshold: new Array(1000).fill(0).map((v, i) => (i + 1) / 1000)
      })
      this.observer.observe(demo)
    }

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

  private handleFullyVisible = (): void => {
    const title = this.title
    title?.style.setProperty("opacity", "1")
    title?.classList.add("in")
    const strong = title?.querySelector("strong")
    strong?.classList.add("in")
    this.clearTimeout()
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
  }

  private step2 = (): void => {
    const win = this.win
    this.animation.changeTitle(this.animation.titles[Math.min(this.animation.switches, this.animation.titles.length - 1)])
    this.timeout = setTimeout(() => {
      win.mode = BeamWindowMode.writing
      this.timeout = setTimeout(this.step3, 2000)
    }, 1350)
  }

  private step3 = (): void => {
    const win = this.win
    if (win.mode === BeamWindowMode.writing) {
      this.animation.changeTitle(this.animation.titles[Math.min(this.animation.switches, this.animation.titles.length - 1)])
    }
    this.timeout = setTimeout(() => {
      win.mode = BeamWindowMode.web
    }, 1350)
  }

  private step4 = (): void => {
    const win = this.win
    this.timeout = setTimeout(() => {
      win.mode = BeamWindowMode.writing
    }, 1350)
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
    const w = this.win?.querySelector(".beam-window") as HTMLElement
    w?.style.setProperty("--transform", `scale(${0.9 + NumberUtil.map(t, 0.375, 1) * 0.1})`)
    w?.style.setProperty("animation", t <= 0.35 ? "bump 0.5s ease-in-out" : "")
  }

  private resetAnimation(resetSwitches = true): void {
    this.animation.cancelAnimation()
    this.animation.rotateBack()
    this.win.captureTarget()
    if (resetSwitches) {
      this.animation.switches = 0
    }
  }
}

new Homepage()