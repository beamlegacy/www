import Page from "common/Page"
import {GoogleAnalytics} from "util/GoogleAnalytics"

export class About extends Page {

  public el: Document = document

  protected init():void {
    // Required
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
