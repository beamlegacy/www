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
