import {gsap} from "gsap"

export class CardStack {

  private el: HTMLElement
  private items: HTMLCollectionOf<Element>
  private observer: IntersectionObserver | undefined
  private isVisible: boolean = false

  private marginY: number = 0
  private cardTop: number = 0
  private cardHeight: number = 0

  constructor(el: HTMLElement) {
    this.el = el
    this.items = this.el.getElementsByClassName("card-stack-item")

    this.init()
    this.reset()
  }

  private init(): void {
    const self = this

    this.observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      this.isVisible = entries[0].isIntersecting
    }, {
      threshold: [0, 1]
    })

    this.observer.observe(document.querySelector(".feature-publish") as HTMLElement)

    let ticking = false

    document.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (self.isVisible) {
            self.position()
          }
          ticking = false
        })

        ticking = true
      }
    }, { passive: true })

    window.addEventListener("resize", () => {
      self.reset()
    })
  }

  /**
   * Calculates dimensions based on --card-stack-gap value (which uses calc)
   */
  private set(): void {
    const cardStyle = getComputedStyle(this.items[0]),
          marginY = getComputedStyle(this.el).getPropertyValue("--card-stack-gap"),
          tmpEl = document.createElement("div")

    tmpEl.setAttribute("style", "opacity:0; visbility: hidden;position: absolute; height:" + marginY)

    this.el.appendChild(tmpEl)
    this.marginY = parseInt(getComputedStyle(tmpEl).getPropertyValue("height"))
    this.el.removeChild(tmpEl)

    this.cardHeight = Math.floor(parseFloat(cardStyle.getPropertyValue("height")))
  }

  /**
   * Sets position of cards
   */
  private position(): void {
    const total = this.items.length - 1,
          elTrigger = document.querySelector(".card-stack") as HTMLElement

    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i] as HTMLElement,
            itemDarken = item.getElementsByClassName("darken")[0] as HTMLElement

      let scale = 1,
          y = item.offsetHeight * i,
          trigger = elTrigger.getBoundingClientRect().top - window.innerHeight + (window.innerHeight * 0.25),
          opacity = 0

      trigger = trigger - ((trigger * 0.1) * i)

      let percent = trigger / -this.cardHeight

      percent = percent - ((percent * 0.1) * i)

      if (percent < 0) {
        percent = 0
      } else if (percent > 1) {
        percent = 1
      }

      y = y - (y * percent)
      scale = 1 - (0.1 * percent) + (percent * (0.05 * ( i)))
      opacity = opacity + (((0.1 * percent) + (percent * (0.05))) * (total- i))

      gsap.to(item, {
        y: y,
        scale: scale,
        ease: "power3",
        duration: 1
      })

      gsap.to(itemDarken, {
        opacity: opacity,
        ease: "power3",
        duration: 1
      })
    }
  }

  private reset(): void {
    this.set()
    this.position()
  }
}
