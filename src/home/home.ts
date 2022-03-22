export class Homepage {
  private observer: IntersectionObserver

  constructor() {
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
      const title = demo?.querySelector(".title") as HTMLElement
      if (ratio >= min && ratio <= max) {
        const mappedRatio = map(ratio, min, max, 0, 1)
        title?.style.setProperty("opacity", `${mappedRatio}`)
        title?.style.setProperty("transform", `translateY(${2 * (1 - mappedRatio)}em)`)
        hero?.style.setProperty("opacity", `${1 - mappedRatio}`)
        hero?.style.setProperty("transform", `scale(${1 - mappedRatio})`)
      } else {
        title?.style.setProperty("opacity", ratio < max ? "0" : "1")
        title?.style.setProperty("transform", `translateY(${ratio < max ? "2" : "0"}em)`)
        hero?.style.setProperty("opacity", ratio < max ? "1" : "0")
        hero?.style.setProperty("transform", `scale(${ratio < max ? "1" : "0"})`)
      }
    }, {threshold: new Array(100).fill(0).map((v, i) => i / 100)})
    if (demo) {
      this.observer.observe(demo)
    }
  }
}

new Homepage()