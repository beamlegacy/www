import {IconWithLabelRevealButton, RevealButton} from "home/beam-window/widget/button/IconWithLabelRevealButton"
import SpyInstance = jest.SpyInstance
import {PublishButton} from "home/beam-window/widget/button/PublishButton"
import {PublishButtonMessages} from "home/beam-window/widget/button/PublishButtonMessages"
import {html} from "util/html/Html"

const messages: PublishButtonMessages = {
  error: "Error",
    publish: "Publish",
    publishing: "Publishing...",
    published: "Published!",
    unpublish: "",
    unpublishing: "",
    unpublished: "",
    url_copied: "URL copied"
}

describe("Publish button", () => {
  let setTimeoutSpy: SpyInstance

  beforeAll(() => {
    window.customElements.define("beam-button-reveal", IconWithLabelRevealButton, {extends: "button"})

    // Mock IntersectionObserver
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.IntersectionObserver = jest.fn(
      (callback: (e: IntersectionObserverEntry[]) => void) => {
        const observe = jest.fn((element) => callback([
          {
            target: element,
            boundingClientRect: {},
            intersectionRatio: 1,
            intersectionRect: {},
            isIntersecting: true,
            rootBounds: {},
            time: 0
          } as IntersectionObserverEntry
        ]));
        const unobserve = jest.fn();

        return {
          observe,
          unobserve,
        }
      }
    )
  })

  beforeEach(() => {
    setTimeoutSpy = jest.spyOn(window, "setTimeout")
    setTimeoutSpy.mockImplementation(cb => {
      cb() && 1
    })
  })

  afterEach(() => {
    document.body.innerHTML = ""
    setTimeoutSpy.mockRestore()
  })

  test("Render PublishButton", () => {
    const publishButton = new PublishButton(messages)
    const button = publishButton.render()
    expect(button.innerHTML).toBe(`<div><span class="icon"><span><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="icn common">
      <path d="M6.25 2.75H4.25C3.42157 2.75 2.75 3.42157 2.75 4.25V11.75C2.75 12.5784 3.42157 13.25 4.25 13.25H11.75C12.5784 13.25 13.25 12.5784 13.25 11.75V9.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
      <path d="M13.25 2.75L7.5 8.5M13.25 2.75H9.25M13.25 2.75V6.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg></span></span><span class="label" tabindex="-1">Publish</span></div>`)
  })
})