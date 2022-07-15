import {BeamWindow, BeamWindowMode} from "./beam-window/BeamWindow"
import SpyInstance = jest.SpyInstance
import {BeamWindowAnimation} from "./BeamWindowAnimation"
import {testWindowContent} from "./beam-window/TestWindowContent"
import FeatureFlagsClient from "../util/FeatureFlagsClient"

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
    testAnimation.playing = true
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
    expect(h1?.innerHTML).toBe(testAnimation.titles[3])
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
    expect(h1?.innerHTML).toBe(testAnimation.titles[3])
  })

  test("Changing tab while capturing the last element continues through the animation", () => {
    testWindow.captureTarget(".capture-last")
    const tab = testWindow.querySelector(".tab[data-page=bmail]") as HTMLElement
    tab.click()
    document.querySelector("h1")?.dispatchEvent(createEvent("animationend", {}))
    const h1 = document.querySelector("h1")
    expect(h1?.innerHTML).toBe(testAnimation.titles[0])
  })

  describe("when the beta is available for download", () => {
    let mockFeatureFlagsCheck: SpyInstance
    beforeAll(() => {
      mockFeatureFlagsCheck = jest
        .spyOn(FeatureFlagsClient, "isEnabled")
        .mockImplementation((feature) => feature === "download beta app" ? true : false)
    })
    afterAll(() => {
      mockFeatureFlagsCheck.mockRestore()
    })
    it("should show the download button", () => {
      expect(testAnimation.titles[4]).toBe("<button class=\"beam-button large download-app\" data-from=\"prototype\">Download beam</button>")
    })
  })
})