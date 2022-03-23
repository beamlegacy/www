import {BeamWindow, BeamWindowMode} from "home/beam-window/BeamWindow"
import {BeamWindowAnimation} from "home/BeamWindowAnimation"

export class Homepage {
  private observer: IntersectionObserver
  private animation: BeamWindowAnimation
  private timeout: ReturnType<typeof setTimeout> | undefined

  constructor() {
    this.animation = new BeamWindowAnimation()
    const demo = document.querySelector(".demo")
    const hero = document.querySelector(".hero") as HTMLElement
    const map =
      (num: number, inputMin: number, inputMax: number, outputMin: number, outputMax: number): number => (
        (num - inputMin) * (outputMax - outputMin)
      ) / (inputMax - inputMin) + outputMin
    this.observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      const ratio = entries[0].intersectionRatio
      const min = 0.4
      const max = 0.8
      let title = demo?.querySelector(".title") as HTMLElement

      if (ratio >= min && ratio <= max) {
        const mappedRatio = map(ratio, min, max, 0, 1)
        hero?.style.setProperty("opacity", `${1 - mappedRatio}`)
        hero?.style.setProperty("transform", `scale(${1 - mappedRatio})`)
      } else {
        hero?.style.setProperty("opacity", ratio < max ? "1" : "0")
        hero?.style.setProperty("transform", `scale(${ratio < max ? "1" : "0"})`)

        const win = document.querySelector("beam-window") as BeamWindow
        if (ratio >= .99) {
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
        } else if (ratio < .4) {
          this.clearTimeout()
          this.animation.cancelAnimation()
          this.animation.switches = 0
          win.mode = BeamWindowMode.web
          this.animation.cancelAnimation()
          this.animation.switches = 0
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
        } else {
          // const mappedRatio = map(ratio, .4, max, 0, 1)
          // console.log(mappedRatio, title)
          // title?.style.setProperty("opacity", ratio < max ? `${mappedRatio}` : "1")
          // title?.style.setProperty("transform", `translateY(${ratio < max ? 4 * mappedRatio : 0}em)`)
        }
      }

      const ratio2 = entries[0].intersectionRatio
      const min2 = 0.4
      const max2 = 1
      if (ratio2 >= min2 && ratio2 <= max2) {
        const mappedRatio = map(ratio2, min2, max2, 0, 1)
        const adjusted = (mappedRatio <= 0.5 ? mappedRatio : 1 - mappedRatio) * 2
        document.body.style.setProperty("--gradient-opacity", `${0.2 + adjusted * 0.2}`)
        document.body.style.setProperty("--gradient-grow", `${(adjusted)* 0.2 * 100}%`)
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

}

new Homepage()