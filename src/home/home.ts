import {BeamWindow, BeamWindowMode} from "home/beam-window/BeamWindow"
import {BeamWindowAnimation} from "home/BeamWindowAnimation"

class NumberUtil {
  static map =
    (num: number, inputMin: number, inputMax: number, outputMin = 0, outputMax = 1): number => (
      outputMin + (
        (num - inputMin) * (outputMax - outputMin)
      ) / (
        inputMax - inputMin
      )
    )
}
export class Homepage {
  private observer: IntersectionObserver
  private animation: BeamWindowAnimation
  private timeout: ReturnType<typeof setTimeout> | undefined

  constructor() {
    this.animation = new BeamWindowAnimation()
    const demo = this.demo
    const win = document.querySelector("beam-window") as BeamWindow

    this.observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      const ratio = entries[0].intersectionRatio
      const min = 0.4
      const max = 0.8
      const titleMin = 0.5
      if (ratio >= min && ratio <= max) {
        const mappedRatio = NumberUtil.map(ratio, min, max, 0, 1)
        this.updateHero(1 - mappedRatio)

        if (ratio >= titleMin) {
          this.clearTimeout()
          this.animation.cancelAnimation()
          this.animation.switches = 0
          const mappedRatio = map(ratio, .4, max, 0, 1)
          this.updateTitleContainer(mappedRatio)
        }

      } else {
        this.updateHero(ratio < max ? 1 : 0)
        this.updateTitleContainer(ratio < max ? 0 : 1)
        if (ratio >= .99) {
          const title = this.title
          title?.style.setProperty("opacity", "1")
          title?.classList.add("in")
          const strong = title?.querySelector("strong")
          strong?.classList.add("in")
          if (win && win.mode === BeamWindowMode.web) {
            this.clearTimeout()
            this.timeout = setTimeout(() => {
              this.timeout = setTimeout(() => {
                win.mode = BeamWindowMode.writing
              }, 1000)
            }, 500)
          }
        } else if (ratio < min) {
          this.animation.cancelAnimation()
          this.animation.switches = 0
          win.mode = BeamWindowMode.web
          let title = this.title
          if (title) {
            const messages = (window as any).messages
            const msg = messages.demo.title
            this.animation.changeTitle(msg, true)
            title = demo?.querySelector(".title") as HTMLElement
            title.classList.remove("in")
            const strong = title?.querySelector("strong")
            strong?.classList.remove("in")
            title.style.setProperty("opacity", "0")
          }
        }
      }

      const ratio2 = entries[0].intersectionRatio
      const min2 = 0.4
      const max2 = 1
      if (ratio2 >= min2 && ratio2 <= max2) {
        const mappedRatio = NumberUtil.map(ratio2, min2, max2, 0, 1)
        const adjusted = (mappedRatio <= 0.5 ? mappedRatio : 1 - mappedRatio) * 2
        document.body.style.setProperty("--gradient-opacity", `${0.2 + adjusted * 0.2}`)
        document.body.style.setProperty("--gradient-grow", `${adjusted * 0.2 * 100}%`)
      } else {
        document.body.style.setProperty("--gradient-opacity", "")
        document.body.style.setProperty("--gradient-grow", "")
      }
    }, {
      rootMargin: "-84px 0px -84px 0px",
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

}

new Homepage()