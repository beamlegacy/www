export type FlashButtonCallback = () => void

interface FlashButtonOpts {
  onOver: FlashButtonCallback,
  onOut: FlashButtonCallback
}

export class FlashButton {

  private element: HTMLElement
  private timer: number = 0

  private opts: FlashButtonOpts = {
    onOver: () => {
      /* Do nothing */
    },
    onOut: () => {
      // Do nothing
    }
  }

  constructor(btn:HTMLElement, opts:FlashButtonOpts) {
    this.element = btn
    this.opts = {...this.opts, ...opts}

    this.init()
  }

  private init():void {
    const self = this

    this.element.addEventListener("mouseover", () => { self.over() }, false)
    this.element.addEventListener("mouseout", () => { self.out() }, false)
  }

  private over(): void {
    document.body.classList.add("is-over")
    document.body.classList.add("glow")
    clearInterval(this.timer)
    this.opts.onOver()
  }

  private out(): void {
    document.body.classList.remove("glow")
    this.timer = window.setTimeout(function() {
      document.body.classList.remove("is-over")
    }, 1000)
    this.opts.onOut()
  }

}
