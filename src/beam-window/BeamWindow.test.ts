import {BeamWindow, BeamWindowMode} from "./BeamWindow"
import {testWindowContent} from "./TestWindowContent"

const createWebComponent = (): BeamWindow => {
  const component = document.createElement("beam-window") as BeamWindow
  component.innerHTML = testWindowContent
  return component
}

function createEvent(type: string, dic: Record<string, any>, target?: any, relatedTarget?: any): Event {
  const ev = Object.assign(new Event(type), dic)
  Object.defineProperty(ev, "target", {
    get: () => target
  })
  Object.defineProperty(ev, "relatedTarget", {
    get: () => relatedTarget
  })
  return ev
}

describe("BeamWindow", () => {
  let testWindow: BeamWindow
  beforeAll(() => {
    window.customElements.define("beam-window", BeamWindow)
  })

  beforeEach(() => {
    testWindow = createWebComponent()
    document.body.appendChild(testWindow)
  })

  afterEach(() => {
    document.body.innerHTML = ""
  })

  test("Rendering component", () => {
    expect(testWindow instanceof BeamWindow).toBe(true)
    expect(testWindow.mode).toBe(BeamWindowMode.web)
  })

  test("Setting initial url", () => {
    document.body.innerHTML = ""
    testWindow = createWebComponent()
    testWindow.setAttribute("start-url", "web/youtube")
    document.body.appendChild(testWindow)
    expect(testWindow.mode).toBe(BeamWindowMode.web)
    expect(testWindow.url).toBe("web/youtube")
    document.body.appendChild(testWindow)
    testWindow.setAttribute("start-url", "web/bmail")
    expect(testWindow.mode).toBe(BeamWindowMode.web)
    expect(testWindow.url).toBe("web/bmail")
    testWindow.setAttribute("start-url", "writing/journal")
    expect(testWindow.mode).toBe(BeamWindowMode.writing)
    expect(testWindow.url).toBe("writing/journal")
  })

  test("Toggling between modes", () => {
    testWindow.toggleMode()
    expect(testWindow.mode).toBe(BeamWindowMode.writing)
    testWindow.toggleMode()
    expect(testWindow.mode).toBe(BeamWindowMode.web)
  })

  test("Set then get url", () => {
    expect(testWindow.url).toBe("web/beam-times")
    testWindow.url = "web/bmail"
    expect(testWindow.url).toBe("web/bmail")
  })

  test("Navigation using url", () => {
    testWindow.url = "writing/journal"
    expect(testWindow.mode).toBe(BeamWindowMode.writing)
    let currentPage = testWindow.querySelector(`${testWindow.containerSelector} > .current`) as HTMLElement
    expect(currentPage.classList.contains("journal")).toBe(true)
    testWindow.url = "web/bmail"
    expect(testWindow.mode).toBe(BeamWindowMode.web)
    currentPage = testWindow.querySelector(`${testWindow.containerSelector} > .current`) as HTMLElement
    expect(currentPage.classList.contains("bmail")).toBe(true)
  })

  test("Capture target content", () => {
    const targetCssClass = "capture-first"
    const page = "beam-times"
    testWindow.url = `web/${page}`
    const win = testWindow.querySelector(".beam-window") as HTMLElement
    expect(win.classList.contains("capturing")).toBe(false)
    testWindow.captureTarget(`.${targetCssClass}`)
    expect(win.classList.contains("capturing")).toBe(true)
    const target = testWindow.getShootTarget() as HTMLElement
    expect(target.classList.contains(targetCssClass)).toBe(true)
    testWindow.captureTarget()
    expect(win.classList.contains("capturing")).toBe(false)
  })

  test("Shoot content", () => {
    const targetCssClass = "capture-first"
    const page = "beam-times"
    testWindow.url = `web/${page}`
    testWindow.captureTarget(`.${targetCssClass}`)
    testWindow.shoot()
    const noteContent = testWindow.querySelector(".journal .view li:first-child ul")
    const firstLi = noteContent?.querySelector("li:first-child") ?? null
    const added = firstLi?.children[0] as HTMLElement
    expect(added.classList.contains(targetCssClass)).toBe(true)
  })

  test("Insert content animation in journal when shooting", () => {
    const targetCssClass = "capture-first"
    const page = "beam-times"
    testWindow.url = `web/${page}`
    testWindow.captureTarget(`.${targetCssClass}`)
    testWindow.shoot()
    const noteContent = testWindow.querySelector(".journal .view li:first-child ul")
    const added = noteContent?.querySelector("li:first-child") as HTMLElement
    expect(added.classList.contains("insert")).toBe(true)
    const win = testWindow.querySelector(".beam-window")
    expect(win).toBeDefined()
    win!.dispatchEvent(createEvent("animationend", {animationName: "beam-window-placeholder-in"}, added))
    expect(added.classList.contains("insert")).toBe(false)
  })

  test("New mode handler, only called once until a new mode is toggled on", () => {
    const handler = jest.fn()
    testWindow.onNewMode(handler)
    testWindow.toggleMode() // writing
    expect(handler).toHaveBeenCalledTimes(1)
    testWindow.toggleMode() // web
    expect(handler).toHaveBeenCalledTimes(2)
    testWindow.mode = BeamWindowMode.web
    expect(handler).toHaveBeenCalledTimes(2)
    testWindow.mode = BeamWindowMode.writing
    expect(handler).toHaveBeenCalledTimes(3)
  })

  test("Clicking tabs toggles navigation", () => {
    const tabs = testWindow.querySelectorAll(".tab") as NodeListOf<HTMLElement>
    expect(tabs.length).toBeGreaterThan(1)
    tabs.forEach(tab => {
      // toggle mode before clicking if needed
      const isWritingTab = !!tab?.parentElement?.classList.contains("tabs-writing")
      testWindow.mode = isWritingTab ? BeamWindowMode.writing : BeamWindowMode.web
      tab.click()
      const page = tab.dataset.page
      const currentPage = testWindow.querySelector(`${testWindow.containerSelector} > .current`) as HTMLElement
      expect(page).toBeDefined()
      expect(currentPage).toBeDefined()
      expect(testWindow.url.endsWith(page!)).toBe(true)
    })
  })

  test("Tab click handler", () => {
    const handler = jest.fn()
    testWindow.onTabClick(handler)
    const tabs = testWindow.querySelectorAll(".tab") as NodeListOf<HTMLElement>
    expect(tabs.length).toBeGreaterThan(1)
    tabs.forEach(tab => {
      // toggle mode before clicking if needed
      const isWritingTab = !!tab?.parentElement?.classList.contains("tabs-writing")
      testWindow.mode = isWritingTab ? BeamWindowMode.writing : BeamWindowMode.web
      tab.click()
    })
    expect(handler).toHaveBeenCalledTimes(tabs.length)
  })

  test("Toggle omnibox open/close", () => {
    const searchBtn = testWindow.querySelector(".controls .search") as HTMLButtonElement
    searchBtn?.click()
    const win = testWindow.querySelector(".beam-window") as HTMLElement
    expect(win.classList.contains("open-omnibox")).toBe(true)
    searchBtn?.click()
    expect(win.classList.contains("open-omnibox")).toBe(false)
  })

  test("Filter results", () => {
    const searchBtn = testWindow.querySelector(".controls .search") as HTMLButtonElement
    searchBtn?.click()
    const input = testWindow.querySelector(".omnibox input") as HTMLInputElement
    input.value = "bmail"
    input.dispatchEvent(createEvent("input", {}, input))
    const results = testWindow.querySelectorAll(".omnibox > .result")
    expect(results.length).toBe(1)
  })

  test("Blurring the omnibox closes the omnibox", () => {
    const searchBtn = testWindow.querySelector(".controls .search") as HTMLButtonElement
    searchBtn?.click()
    const input = testWindow.querySelector(".omnibox input") as HTMLInputElement
    input.dispatchEvent(createEvent("blur", {}, input))
    const win = testWindow.querySelector(".beam-window") as HTMLElement
    expect(win.classList.contains("open-omnibox")).toBe(false)
  })

  test("Blurring to focus a result does not close the omnibox", () => {
    const searchBtn = testWindow.querySelector(".controls .search") as HTMLButtonElement
    searchBtn?.click()
    const input = testWindow.querySelector(".omnibox input") as HTMLInputElement
    const result = testWindow.querySelector(".omnibox > .result")
    input.dispatchEvent(createEvent("blur", {}, input, result))
    const win = testWindow.querySelector(".beam-window") as HTMLElement
    expect(win.classList.contains("open-omnibox")).toBe(true)
  })

  test("Pressing escape in the omnibox closes it", async () => {
    const searchBtn = testWindow.querySelector(".controls .search") as HTMLButtonElement
    searchBtn?.click()
    const omnibox = testWindow.querySelector(".omnibox") as HTMLElement
    omnibox.dispatchEvent(createEvent("keydown", {key: "Escape"}))
    const win = testWindow.querySelector(".beam-window") as HTMLElement
    expect(win.classList.contains("open-omnibox")).toBe(false)
  })
})