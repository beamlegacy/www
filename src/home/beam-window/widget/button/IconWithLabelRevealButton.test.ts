import {IconWithLabelRevealButton, RevealButton} from "home/beam-window/widget/button/IconWithLabelRevealButton"
import {html} from "util/html/Html"
import {IconLink} from "home/beam-window/widget/icons/IconLink"
import SpyInstance = jest.SpyInstance

describe("IconWithLabelRevealButton", () => {
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

  test("RevealButton is closed by default", () => {
    const testText = "test text"
    const testClass = "test-class"
    const button = html`<button is="beam-button-reveal"/>` as RevealButton
    document.body.appendChild(button)
    const icon = document.createElement("span")
    icon.classList.add(testClass)
    button.icon =  icon
    button.label = testText
    expect(button.open).toBe(false)
    expect(button.classList.contains("active")).toBe(false)
  })

  test("Open / close the button to reveal label", () => {
    const testText = "test text"
    const testClass = "test-class"
    const button = html`<button is="beam-button-reveal"/>` as RevealButton
    document.body.appendChild(button)
    const icon = document.createElement("span")
    icon.classList.add(testClass)
    button.icon =  icon
    button.label = testText
    expect(button.open).toBe(false)
    expect(button.classList.contains("active")).toBe(false)
    button.open = true
    expect(button.open).toBe(true)
    expect(button.classList.contains("active")).toBe(true)
    button.open = false
    expect(button.open).toBe(false)
    expect(button.classList.contains("active")).toBe(false)
  })

  test("Blurring from an open RevealButton closes it", () => {
    const testText = "test text"
    const testClass = "test-class"
    const button = html`<button is="beam-button-reveal"/>` as RevealButton
    document.body.appendChild(button)
    const icon = document.createElement("span")
    icon.classList.add(testClass)
    button.icon =  icon
    button.label = testText
    button.classList.add("active")
    expect(button.classList.contains("active")).toBe(true)
    button.dispatchEvent(new FocusEvent("blur"))
    expect(button.classList.contains("active")).toBe(false)
  })
})