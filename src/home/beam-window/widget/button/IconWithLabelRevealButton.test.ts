import {IconWithLabelRevealButton, RevealButton} from "home/beam-window/widget/button/IconWithLabelRevealButton"
import {html} from "util/html/Html"
import {IconLink} from "home/beam-window/widget/icons/IconLink"
import SpyInstance = jest.SpyInstance

describe("IconWithLabelRevealButton", () => {
  let setTimeoutSpy: SpyInstance

  beforeAll(() => {
    window.customElements.define("beam-button-reveal", IconWithLabelRevealButton, {extends: "button"})

    // Mock IntersectionObserver
    const observe = jest.fn();
    const unobserve = jest.fn();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.IntersectionObserver = jest.fn(() => ({
      observe,
      unobserve,
    }))
  })

  beforeEach(() => {
    setTimeoutSpy = jest.spyOn(window, "setTimeout")
    setTimeoutSpy.mockImplementation(cb => cb() && 1)
  })

  afterEach(() => {
    document.body.innerHTML = ""
    setTimeoutSpy.mockRestore()
  })

  test("Render button with given icon and label", () => {
    const testText = "test text"
    const testClass = "test-class"
    const button = html`<button is="beam-button-reveal"/>` as RevealButton
    document.body.appendChild(button)
    const icon = document.createElement("span")
    icon.classList.add(testClass)
    button.icon =  icon
    button.label = testText
    expect(button.querySelector(`.${testClass}`)).toBe(icon)
    expect(button.textContent?.indexOf(testText)).not.toBe(-1)
  })
})