import {Hero} from "./../Hero"

import {gsap} from "gsap"
import {ScrollTrigger} from "gsap/dist/ScrollTrigger"
import * as paper from "paper"

gsap.registerPlugin(ScrollTrigger)

export class Transition {

  private el: HTMLElement = document.querySelector(".hero-transition") as HTMLElement
  private parent: Hero | null
  private lastPercent: number = 0;

  private pathMain: any
  private path: any

  private canvas: HTMLCanvasElement | null = document.getElementById("hero-canvas") as HTMLCanvasElement;
  private paperCanvas: any

  private scroller: any = {
    y: 0,
    percent: 0
  }

  protected timer: number = 0

  constructor(parent:Hero) {
    this.parent = parent
  }

  public load():void {
    this.setup()
  }

  private setup(): void {
    const self = this

    if (this.canvas) {
      this.paperCanvas = paper.setup(this.canvas)

      const sizes = this.getSize()

      this.pathMain = new paper.Path.Rectangle({
        width: sizes.width,
        height: sizes.height,
        center: new paper.Point(0, 0),
        radius: 0
      })

      this.path = new paper.CompoundPath({
        children: [
          this.pathMain,
          new paper.Path.Rectangle({
            width: 0,
            height: 0,
            center: new paper.Point(0, 0),
            radius: 0
          })
        ],
        fillColor: getComputedStyle(document.documentElement).getPropertyValue("--color-background")
      })
    }

    this.bind()
    this.update()

    if (window.matchMedia) {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
        self.update()
      })

      window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", function () {
        self.update()
      })
    }

    setTimeout(function() {
      self.update()
    }, 300)
  }

  protected bind():void {
    const self = this

    window.addEventListener("resize", () => {
      self.update()
    }, { passive: true })

    window.addEventListener("scroll", () => {
      self.update()
    }, { passive: true })

    gsap.to(this.scroller, {
      y: 1,
      ease: "linear",
      onUpdate: function() {
        self.scroller.percent = this.progress()
        self.update()
      },
      scrollTrigger: {
        trigger: ".hero",
        start: "0%",
        end: "50%",
        scrub: 0.4
      }
    })

    gsap.ticker.add(function() {
      self.update()
    })
  }

  protected updateCanvas(scrollPercent:number): void {
    if (this.canvas && this.el && this.parent && this.parent.el) {

      const icon = this.parent.el.querySelector(".beam-icon img") as HTMLElement,
            scrollbarWidth = (window.innerWidth - document.body.clientWidth),
            width = window.innerWidth - (scrollbarWidth / 2),
            height = window.innerHeight

      if (scrollPercent >= 0.15) {
        this.toggleClass(false)
        this.parent.el.style.pointerEvents = "none"
      } else if (scrollPercent < 0.15) {
        this.toggleClass(true)
        this.parent.el.style.pointerEvents = ""
      }

      if (scrollPercent === 1) {
        this.parent.el.style.visibility = "hidden"
      } else {
        this.parent.el.style.visibility = ""
      }

      const iconSize = icon.getBoundingClientRect().width,
            rectSize = 100,
            radius = 25,
            rectWidth = rectSize + ((width - rectSize) * scrollPercent),
            rectHeight = rectSize + ((height - rectSize) * scrollPercent)

      let iconPosition = icon.getBoundingClientRect().top,
          iconOffset = ((rectHeight - iconSize) / 2)

      iconOffset = ((iconOffset - (iconOffset * scrollPercent)) * (1 - scrollPercent))
      iconPosition = iconPosition - iconOffset
      iconPosition = iconPosition - (iconPosition * scrollPercent)

      const rectX = (width / 2) - (rectWidth / 2),
            rectY = iconPosition,
            radiusFinal = (width > 568) ? 5 : 0,
            radiusDynamic = 200 - ((200 / rectWidth) * 100),
            rectRadius = (radius * (1-scrollPercent)) + (radiusFinal * scrollPercent) + (radiusDynamic * (.5 - (Math.abs(scrollPercent - Math.floor(scrollPercent) - .5))))

      this.pathMain.bounds.size = [width, height+150]

      this.path.remove()

      this.path = new paper.CompoundPath({
        children: [
          this.pathMain,
          new paper.Path.Rectangle({
            width: rectWidth,
            height: rectHeight,

            x: rectX,
            y: rectY,
            radius: rectRadius
          })
        ],
        fillColor: getComputedStyle(document.documentElement).getPropertyValue("--color-body-bg")
      })

      this.path.reorient()
    }
  }

  /**
   * Upate properties
   */
  protected update():void {
    if (this.el && this.parent && this.parent.parent.el) {
      const scrollPercent = this.scroller.percent

      if (this.lastPercent < 1) {
        this.updateCanvas(scrollPercent)
        this.updateElements(scrollPercent)
      }

      this.lastPercent = scrollPercent
    }
  }

  protected toggleClass(visible: boolean):void {
    if (visible) {
      clearInterval(this.timer)
      document.body.classList.add("is-transitioning")
      document.body.classList.add("is-transition")
    } else if (document.body.classList.contains("is-transition")) {
      clearInterval(this.timer)
      document.body.classList.remove("is-transition")
      this.timer = window.setTimeout(function() {
        document.body.classList.remove("is-transitioning")
      }, 1100)
    }
  }

   protected getSize():any {
    const scrollbarWidth = (window.innerWidth - document.body.clientWidth)

    const obj = {
      width: window.innerWidth - (scrollbarWidth / 2),
      height: window.innerHeight
    }

    return obj
  }

  /**
   * Update element properties
   */
  protected updateElements(scrollPercent:number):void {
    if (this.parent && this.parent.el && this.parent.parent && this.parent.parent.background && this.parent.parent.background.el) {
      const container = this.parent.el.querySelector(".container") as HTMLElement,
            title = this.parent.el.querySelector(".beam-title") as HTMLElement,
            icon = this.parent.el.querySelector(".beam-icon") as HTMLElement,
            button = this.parent.el.querySelector(".beam-button") as HTMLElement,
            offset = (1 - (scrollPercent * 2.5))

      container.style.opacity = String(1 * offset)
      button.style.transform = `scale(${1 - (0.5 * scrollPercent)})`
      title.style.transform = `scale(${1 - (0.5 * scrollPercent)})`
      icon.style.transform = `scale(${1 - (0.5 * scrollPercent)})`
    }
  }

}
