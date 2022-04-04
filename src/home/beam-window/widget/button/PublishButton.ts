import {RevealButton} from "home/beam-window/widget/button/IconWithLabelRevealButton"
import {PublishButtonMessages} from "home/beam-window/widget/button/PublishButtonMessages"
import {html} from "util/html/Html"
import {IconCheckmark} from "home/beam-window/widget/icons/IconCheckmark"
import {IconEditorPublish} from "home/beam-window/widget/icons/IconEditorPublish"
import {IconLink} from "home/beam-window/widget/icons/IconLink"
import {Tooltip} from "home/beam-window/widget/tooltip/Tooltip"

export class PublishButton {
  private timeout: ReturnType<typeof window.setTimeout> | undefined

  constructor(
    public messages: PublishButtonMessages,
    private publishButton = html`<button is="beam-button-reveal"/>` as unknown as RevealButton,
    private isPublished = false
  ) {
  }

  getPublishHandler(): () => Promise<void> {
    return async () => {
      this.publishButton.open = true
      if (!this.isPublished) {
        let error: Error | undefined
        this.publishButton.label = this.isPublished ? this.messages.unpublishing : this.messages.publishing
        if (!this.isPublished) {
          await new Promise(resolve => setTimeout(resolve, 750))
        }
        this.afterPublish() // see TODO
        // last but not least, throw error if any
      } else {
        this.publishButton.setAttribute("data-tooltip", this.messages.url_copied)
        this.publishButton.dispatchEvent(new MouseEvent("mouseenter"))
        this.timeout = setTimeout(() => {
          this.publishButton.open = false
          this.publishButton.removeAttribute("data-tooltip")
        }, 2000)
      }
    }
  }

  render(): RevealButton {
    this.setupButton()
    new Tooltip(this.publishButton)
    return this.publishButton
  }

  private afterPublish(error?: Error) {
    // TODO move to a Promise based timeout so we can sync the toast and the error feedback in button
    // the timeout is to make sure the "Publishing..." or "Unpublishing..." message had time to animate in
    // as it feels flaky when the error pops right away after clicking
    if (!this.isPublished) {
      if (!error) {
        this.isPublished = true
        // this.isPublished = !this.isPublished
      }
      this.timeout && clearTimeout(this.timeout)
      this.timeout = setTimeout(this.getAfterPublishCallback(error), 250)
    }
  }

  private getAfterPublishCallback(error?: Error) {
    return () => {
      if (error) {
        // this.publishButton.icon = new IconError(context).element
        // this.publishButton.label = this.messages.error
      } else {
        this.publishButton.icon = new IconCheckmark().element
        this.publishButton.label = this.isPublished ? this.messages.published : this.messages.unpublished
        if (this.isPublished) {
          this.publishButton.setAttribute("data-tooltip", this.messages.url_copied)
          this.publishButton.dispatchEvent(new MouseEvent("mouseenter"))
        }
      }
      // Restore button to its normal state (publish or unpublish)
      this.timeout && clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.setupButton()
        this.publishButton.removeAttribute("data-tooltip")
        this.publishButton.open = false
      }, 2000)
    }
  }

  private setupButton() {
    if (this.isPublished) {
      this.publishButton.icon = new IconLink().element
      this.publishButton.label = this.messages.unpublish
      this.publishButton.classList.add("published")
    } else {
      this.publishButton.icon = new IconEditorPublish().element
      this.publishButton.label = this.messages.publish
      this.publishButton.classList.remove("published")
    }
  }

  reset() {
    this.isPublished = false
    this.render()
  }
}
