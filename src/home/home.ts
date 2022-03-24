import {BeamWindow, BeamWindowMode} from "home/beam-window/BeamWindow"
import {BeamWindowAnimation} from "home/BeamWindowAnimation"

class NumberUtil {
  static clamp(input: number, min: number, max: number): number {
    return input < min ? min : input > max ? max : input
  }

  static map =
    (
      num: number,
      inputMin: number, inputMax: number,
      outputMin = 0, outputMax = 1
    ): number => NumberUtil.clamp(
      outputMin + (
        (num - inputMin) * (outputMax - outputMin)
      ) / (
        inputMax - inputMin
      ),
      outputMin,
      outputMax
    )
}

export class Homepage {
  private observer: IntersectionObserver
  private animation: BeamWindowAnimation
  private timeout: ReturnType<typeof setTimeout> | undefined
  private win: BeamWindow

  constructor() {
    this.animation = new BeamWindowAnimation()
    const demo = this.demo
    this.win = document.querySelector("beam-window") as BeamWindow

    const betaSignup = document.querySelector(".beta-signup") as HTMLElement
    const betaSignupButton = betaSignup?.querySelector(":scope > button") as HTMLButtonElement
    const actionButton = betaSignup?.querySelector(":scope .input > button") as HTMLButtonElement
    const betaSignupInputContainer = betaSignup?.querySelector(":scope .input") as HTMLButtonElement
    betaSignupButton?.addEventListener("click", () => {
      betaSignup?.classList.add("show-input")
      const input = betaSignupInputContainer.querySelector("input") as HTMLInputElement
      input?.focus()
    })
    actionButton?.addEventListener("click", () => {
      betaSignup?.classList.remove("show-input")
    })
    betaSignupInputContainer?.addEventListener("blur", (e: FocusEvent) => {
      if (!e.relatedTarget || !betaSignupInputContainer.contains(e.relatedTarget as Node)) {
        const windows = document.querySelectorAll("beam-window") as NodeListOf<BeamWindow>
        const inWindow = Array.from(windows).some(w => w.contains(e.relatedTarget as Node))
        if (inWindow) {
          betaSignupButton.click()
        } else {
          betaSignup?.classList.remove("show-input")
        }
      }
    }, true)

    this.observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      const {win} = this
      const ratio = entries[0].intersectionRatio
      const min = 0.4
      const max = 0.8
      const titleMin = 0.5

      const mappedRatio = NumberUtil.map(ratio, min, max)
      this.updateHero(1 - mappedRatio)

      if (ratio <= 0.9) {
        this.clearTimeout()
        this.resetAnimation()
      }

      if (mappedRatio === 1) {
        const title = this.title
        title?.style.setProperty("opacity", "1")
        title?.classList.add("in")
        const strong = title?.querySelector("strong")
        strong?.classList.add("in")
        if (win && win.mode === BeamWindowMode.web) {
          this.clearTimeout()
          this.timeout = setTimeout(() => {
            this.timeout = setTimeout(() => {
              this.animation.changeTitle(this.animation.titles[Math.min(this.animation.switches, this.animation.titles.length - 1)])
              this.timeout = setTimeout(() => {
                win.mode = BeamWindowMode.writing
                this.timeout = setTimeout(() => {
                  this.animation.changeTitle(this.animation.titles[Math.min(this.animation.switches, this.animation.titles.length - 1)])
                  this.timeout = setTimeout(() => {
                    win.mode = BeamWindowMode.web
                  }, 1500)
                }, 2000)
              }, 1500)
            }, 1000)
          }, 500)
        }
      } else if (mappedRatio === 0) {
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
      threshold: new Array(100).fill(0).map((v, i) => (i + 1) / 100)
    })
    if (demo) {
      this.observer.observe(demo)
    }
  }

  clearTimeout = (): void => {
    this.timeout && clearTimeout(this.timeout)
  }

  get demo(): HTMLElement | null {
    return document.querySelector(".demo")
  }

  get title(): HTMLElement | null {
    return document.querySelector(".demo .title")
  }

  get hero(): HTMLElement | null {
    return document.querySelector(".hero")
  }

  get titleContainer(): HTMLElement {
    return document.querySelector(".title-container") as HTMLElement
  }

  updateHero(t: number): void {
    const hero = this.hero
    hero?.style.setProperty("opacity", `${t}`)
    hero?.style.setProperty("transform", `scale(${t})`)
  }

  updateTitleContainer(t: number): void {
    const titleContainer = this.titleContainer
    titleContainer?.style.setProperty("opacity", `${t}`)
    titleContainer?.style.setProperty("transform", `translateY(${10 * (1 - t)}em)`)
  }

  updateWin(t: number): void {
    const w = this.win?.querySelector(".beam-window") as HTMLElement
    w?.style.setProperty("--transform", `scale(${0.9 + NumberUtil.map(t, 0.375, 1) * 0.1})`)
    w?.style.setProperty("animation", t <= 0.35 ? "bump 0.5s ease-in-out" : "")
  }

  resetAnimation(): void {
    this.animation.cancelAnimation()
    this.animation.rotateBack()
    this.win.captureTarget()
    this.animation.switches = 0
  }
}

new Homepage()