import {BeamWindow, BeamWindowMode} from "./beam-window/BeamWindow"
import SpyInstance = jest.SpyInstance
import {BeamWindowAnimation} from "./BeamWindowAnimation"
import {testWindowContent} from "./beam-window/TestWindowContent"

const createWebComponent = (): BeamWindow => {
  const component = document.createElement("beam-window") as BeamWindow
  component.innerHTML = testWindowContent
  return component
}

function createEvent(type: string, dic: Record<string, any>, target?: any): Event {
  const ev = Object.assign(new Event(type), dic)
  Object.defineProperty(ev, "target", {
    get: () => target
  })
  return ev
}

describe("BeamWindowAnimation", () => {
  let testAnimation: BeamWindowAnimation
  let testWindow: BeamWindow
  let setTimeoutSpy: SpyInstance

  beforeAll(() => {
    window.customElements.define("beam-window", BeamWindow)
  })

  beforeEach(() => {
    testWindow = createWebComponent()
    const container = document.createElement("div")
    container.classList.add("beam-site")
    const main = document.createElement("main")
    main.classList.add("demo")
    container.appendChild(main)
    const h1 = document.createElement("h1")
    h1.classList.add("title")
    h1.innerHTML = "Start title"
    main.appendChild(h1)
    main.appendChild(testWindow)
    document.body.appendChild(container)
    testAnimation = new BeamWindowAnimation()
    setTimeoutSpy = jest.spyOn(window, "setTimeout")
    setTimeoutSpy.mockImplementation(cb => cb() && 1)
  })

  afterEach(() => {
    document.body.innerHTML = ""
    setTimeoutSpy.mockRestore()
  })

  test("Pressing return moves through the animation", () => {
    window.dispatchEvent(createEvent("keypress", {key: "Enter"}))
    document.querySelector("h1")?.dispatchEvent(createEvent("animationend", {}))
    let h1 = document.querySelector("h1")
    expect(h1?.innerHTML).toBe(testAnimation.titles[0])
    window.dispatchEvent(createEvent("keypress", {key: "Enter"}))
    document.querySelector("h1")?.dispatchEvent(createEvent("animationend", {}))
    expect(testWindow.mode).toBe(BeamWindowMode.writing)
    h1 = document.querySelector("h1")
    expect(h1?.innerHTML).toBe(testAnimation.titles[2])
  })

  test("Clicking the switcher moves through the animation", () => {
    const switcher = testWindow.querySelector(".controls .switcher") as HTMLElement
    switcher.click()
    document.querySelector("h1")?.dispatchEvent(createEvent("animationend", {}))
    let h1 = document.querySelector("h1")
    expect(h1?.innerHTML).toBe(testAnimation.titles[0])
    expect(testWindow.mode).toBe(BeamWindowMode.writing)
    switcher.click()
    document.querySelector("h1")?.dispatchEvent(createEvent("animationend", {}))
    h1 = document.querySelector("h1")
    expect(h1?.innerHTML).toBe(testAnimation.titles[2])
  })

  test("Changing tab while capturing the last element continues through the animation", () => {
    testWindow.captureTarget(".capture-last")
    const tab = testWindow.querySelector(".tab[data-page=bmail]") as HTMLElement
    tab.click()
    document.querySelector("h1")?.dispatchEvent(createEvent("animationend", {}))
    const h1 = document.querySelector("h1")
    expect(h1?.innerHTML).toBe(testAnimation.titles[0])
  })
})