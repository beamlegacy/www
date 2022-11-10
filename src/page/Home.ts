import Page from "common/Page"
import {GoogleAnalytics} from "util/GoogleAnalytics"

import {Background} from "./home/Background"
import {Hero} from "./home/Hero"
import {Features} from "./home/Features"
import {FlashButton} from "component/button/FlashButton"

export class Home extends Page {

  public el: Document = document
  public background: Background | null = null
  private hero: Hero | null = null
  private features: Features | null = null

  protected init():void {
    this.background = new Background(this)
    this.hero = new Hero(this)
    this.features = new Features()

    this.initFlashButtons()
    this.initFooterObserver()
  }

  public load(): void {
    if (this.hero) {
      this.hero.load()
    }
  }

  public preload(callback: any): void {
    const self = this,
          items: any = {
            video: {
              loader: () => {
                function check() {
                  if (self.background && self.background.video.el && self.background.video.el.readyState >= 3){
                     items.video.loaded = true
                     self.background.video.el.play()
                   }
                }

                if (self.background && self.background.video && self.background.video.el) {
                  self.background.video.el.addEventListener("loadeddata", () => {
                     check()
                  })
                }

                check()
              },
              loaded: false
            }
          }

    for (const i in items) {
      items[i].loader()
    }

    const timer = setInterval(() => {
      const total = Object.keys(items).length
      let loaded = 0

      for (const i in items) {
        const item: any = items[i]

        if (item.loaded === true) {
          loaded++
        }
      }

      if (loaded === total) {
        clearInterval(timer)

        if (callback) {
          callback()
        }
      }
    }, 250)
  }

  private initFlashButtons(): void {
    const self = this
    const buttons = document.querySelectorAll(".button-flash");

    [].forEach.call(buttons, (btn:HTMLElement) => {
      new FlashButton(btn, {
        onOver: () => {
          if (self.background) {
            self.background.video.setVideoSpeed("fast")
          }
        },
        onOut: () => {
          if (self.background) {
            self.background.video.setVideoSpeed("normal")
          }
        }
      })
    })
  }

  protected initFooterObserver(): void {
    if (this.app) {
      this.app.footer.addObservation((ratio: number, mapped: number) => {
        if (mapped > 0 && !GoogleAnalytics.eventFired("scroll_bottom")) {
          GoogleAnalytics.trackEvent("scroll_bottom")
        }
      })
    }
  }

}
