import {RevealButton} from "home/beam-window/widget/button/IconWithLabelRevealButton"
import {PublishButtonMessages} from "home/beam-window/widget/button/PublishButtonMessages"
import {html} from "util/html/Html"
import {IconCheckmark} from "home/beam-window/widget/icons/IconCheckmark"
import {IconEditorUnpublish} from "home/beam-window/widget/icons/IconEditorUnpublish"
import {IconEditorPublish} from "home/beam-window/widget/icons/IconEditorPublish"

export class PublishButton {
  private publishButton: RevealButton

  private isPublished: boolean

  private timeout: ReturnType<typeof setTimeout> | undefined

  constructor(
    private messages: PublishButtonMessages
  ) {
    this.publishButton = html`<button is="beam-button-reveal"/>` as unknown as RevealButton
    this.isPublished = false
  }

  getPublishHandler(): () => Promise<void> {
    return async () => {
      let error: Error | undefined
      this.publishButton.open = true
      this.publishButton.label = this.isPublished ? this.messages.unpublishing : this.messages.publishing
      try {
        if (this.isPublished) {
          // unpublish
        } else {
          // publish
          this.isPublished = true
        }
      } catch (e) {
        error = e as Error // we will throw after the publish callback
      }
      this.afterPublish(error) // see TODO
      // last but not least, throw error if any
      if (error) {
        throw error
      }
    }
  }

  render(): RevealButton {
    this.setupButton()
    // new Tooltip(this.publishButton)
    return this.publishButton
  }

  private afterPublish(error?: Error) {
    // TODO move to a Promise based timeout so we can sync the toast and the error feedback in button
    // the timeout is to make sure the "Publishing..." or "Unpublishing..." message had time to animate in
    // as it feels flaky when the error pops right away after clicking
    if (!error) {
      this.isPublished = !this.isPublished
    }
    this.timeout && clearTimeout(this.timeout)
    this.timeout = setTimeout(this.getAfterPublishCallback(error), 250)
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
      this.publishButton.icon = new IconEditorUnpublish().element
      this.publishButton.label = this.messages.unpublish
    } else {
      this.publishButton.icon = new IconEditorPublish().element
      this.publishButton.label = this.messages.publish
    }
  }
}
