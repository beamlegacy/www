import {NumberUtil} from "util/NumberUtil"

export type ObservationCallback = (ratio: number, mapped: number) => void

export class Footer {

  private el: HTMLElement | null
  private observer: IntersectionObserver | undefined
  private observations: Array<ObservationCallback> = []

  constructor(initiate:boolean = true) {
    this.el = document.querySelector("footer")
    if (initiate) this.init()
  }

  public init(): void {
    this.initObserver()
  }

  protected initObserver(): void {
    if (this.el) {
      this.observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
        const ratio = entries[0].intersectionRatio
        const mapped = NumberUtil.map(ratio, 0, 1)

        for (let i = 0; i < this.observations.length; i++) {
          const observation = this.observations[i]
          observation(ratio, mapped)
        }
      }, {
        rootMargin: "0px 0px -25px 0px",
        threshold: new Array(1000).fill(0).map((v, i) => (i + 1) / 1000)
      })

      this.observer.observe(this.el)
    }
  }

  public addObservation(callback: ObservationCallback):void {
    this.observations.push(callback)
  }

  public get(): HTMLElement | null {
    return this.el
  }

}
