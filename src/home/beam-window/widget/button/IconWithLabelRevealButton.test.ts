import {IconWithLabelRevealButton, RevealButton} from "home/beam-window/widget/button/IconWithLabelRevealButton"
import {html} from "util/html/Html"
import {IconLink} from "home/beam-window/widget/icons/IconLink"

describe("IconWithLabelRevealButton", () => {
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

  afterEach(() => {
    document.body.innerHTML = ""
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