import {Homepage} from "home/Homepage"
import {BeamWindow, BeamWindowMode} from "home/beam-window/BeamWindow"
import {testWindowContent} from "home/beam-window/TestWindowContent"
import SpyInstance = jest.SpyInstance
import {IconWithLabelRevealButton} from "home/beam-window/widget/button/IconWithLabelRevealButton"
import {BeamWindowAnimation} from "home/BeamWindowAnimation"

const pages = require("../../pages.js")

describe("Home page", () => {
  let setTimeoutSpy: SpyInstance
  const originalSetTimeout = window.setTimeout
  let intersectioObserverMockedObserveValues = {
    boundingClientRect: {},
    intersectionRatio: 0,
    intersectionRect: {},
    isIntersecting: false,
    rootBounds: {},
    time: 0
  }
  const resetContent = () => document.body.innerHTML = `
<div class="beam-site home">
    <header>
      <span class="beam-logo">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        </svg>
        beam
        <span class="beta">beta</span>
      </span>

      <div class="nav">
        <div class="beta-signup">
          <button class="underline"><%= htmlWebpackPlugin.options.messages.header.betaSignup %></button>
          <form class="input" novalidate>
            <input type="email" required name="zXmAeBqfd" autocomplete="off" placeholder="<%= htmlWebpackPlugin.options.messages.header.betaSignupPlaceholder %>">
            <div class="action-container">
              <button type="button" class="button-close">×</button>
              <button type="submit" class="button-arrow">-></button>
            </div>
          </form>
          <div class="output"></div>
        </div>
      </div>
    </header>
    <main>
      <div class="hero">
        <h1><%= htmlWebpackPlugin.options.messages.title %></h1>
        <p><%= htmlWebpackPlugin.options.messages.subtitle %></p>
      </div>
      <div class="demo">
        <div class="title-container">
          <h2 class="title" style="opacity: 0"><%= htmlWebpackPlugin.options.messages.demo.title %></h2>
        </div>
        <div class="perspective-container">
          <div class="beam-window-container">
            <beam-window class="win">
              ${testWindowContent}
            </beam-window>
          </div>
        </div>
      </div>
    </main>
    <footer>
      <div class="content">
        © <%= htmlWebpackPlugin.options.messages.footer.year %> beam
        <a class="underline" href="<%= htmlWebpackPlugin.options.messages.footer.twitterUrl %>" target="_blank" rel="noopener"><%= htmlWebpackPlugin.options.messages.footer.twitter %></a>
        /
        <a class="underline" href="<%= htmlWebpackPlugin.options.messages.footer.aboutUrl %>" target="_blank" rel="noopener"><%= htmlWebpackPlugin.options.messages.footer.about %></a>
        /
        <a class="underline" href="<%= htmlWebpackPlugin.options.messages.footer.jobsUrl %>" target="_blank" rel="noopener"><%= htmlWebpackPlugin.options.messages.footer.jobs %></a>
        /
        <a class="underline" href="<%= htmlWebpackPlugin.options.messages.footer.whyUrl %>" target="_blank" rel="noopener"><%= htmlWebpackPlugin.options.messages.footer.why %></a>
      </div>
    </footer>
  </div>
    `

  beforeAll(() => {
    (window as any).messages = pages[0].messages
    window.customElements.get("beam-window") || window.customElements.define("beam-window", BeamWindow)

    // Mock IntersectionObserver
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.IntersectionObserver = jest.fn(
      (callback: (e: IntersectionObserverEntry[]) => void) => {
        const observe = jest.fn((element) => callback([
          {
            target: element,
            ...intersectioObserverMockedObserveValues
          } as IntersectionObserverEntry
        ]))
        const unobserve = jest.fn()

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
    resetContent()
  })

  afterEach(() => {
    document.body.innerHTML = ""
    setTimeoutSpy.mockRestore()
  })


  test("Animation is not playing when window is not fully visible", () => {
    intersectioObserverMockedObserveValues = {
      boundingClientRect: {},
      intersectionRatio: 0,
      intersectionRect: {},
      isIntersecting: false,
      rootBounds: {},
      time: 0
    }
    const home = new Homepage()
    expect(home.animation.playing).toBe(false)
  })

  test("Animation plays when window is fully visible", () => {
    intersectioObserverMockedObserveValues = {
      boundingClientRect: {},
      intersectionRatio: 1,
      intersectionRect: {},
      isIntersecting: false,
      rootBounds: {},
      time: 0
    }
    const home = new Homepage()
    expect(home.animation.playing).toBe(true)
  })

  describe("Returning to the web", () => {
    test("Resets publish button when transition ends", () => {
      const home = new Homepage()
      const win = home.win
      win.url = "writing/note"
      const button = win.querySelector(`${win.containerSelector} > .current button`) as HTMLButtonElement
      const writing = win.querySelector(".content .writing") as HTMLElement
      expect(button).toBeDefined()
      expect(writing).toBeDefined()
      button.click()
      expect(button.innerHTML).toBe(`<div><span class="icon"><span><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="icn common">
      <path d="M6.25 2.75H4.25C3.42157 2.75 2.75 3.42157 2.75 4.25V11.75C2.75 12.5784 3.42157 13.25 4.25 13.25H11.75C12.5784 13.25 13.25 12.5784 13.25 11.75V9.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
      <path d="M13.25 2.75L7.5 8.5M13.25 2.75H9.25M13.25 2.75V6.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg></span></span><span class="label" tabindex="-1">Publishing...</span></div>`)
      win.mode = BeamWindowMode.web
      writing.dispatchEvent(new Event("transitionend"))
      expect(button.innerHTML).toBe(`<div><span class="icon"><span><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="icn common">
      <path d="M6.25 2.75H4.25C3.42157 2.75 2.75 3.42157 2.75 4.25V11.75C2.75 12.5784 3.42157 13.25 4.25 13.25H11.75C12.5784 13.25 13.25 12.5784 13.25 11.75V9.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
      <path d="M13.25 2.75L7.5 8.5M13.25 2.75H9.25M13.25 2.75V6.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg></span></span><span class="label" tabindex="-1">Publish</span></div>`)
    })

    test("Keeps publish button state when transition is canceled", () => {
      const home = new Homepage()
      const win = home.win
      win.url = "writing/note"
      const button = win.querySelector(`${win.containerSelector} > .current button`) as HTMLButtonElement
      const writing = win.querySelector(".content .writing") as HTMLElement
      expect(button).toBeDefined()
      expect(writing).toBeDefined()
      button.click()
      expect(button.innerHTML).toBe(`<div><span class="icon"><span><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="icn common">
      <path d="M6.25 2.75H4.25C3.42157 2.75 2.75 3.42157 2.75 4.25V11.75C2.75 12.5784 3.42157 13.25 4.25 13.25H11.75C12.5784 13.25 13.25 12.5784 13.25 11.75V9.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
      <path d="M13.25 2.75L7.5 8.5M13.25 2.75H9.25M13.25 2.75V6.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg></span></span><span class="label" tabindex="-1">Publishing...</span></div>`)
      win.mode = BeamWindowMode.web
      writing.dispatchEvent(new Event("transitioncancel"))
      expect(button.innerHTML).toBe(`<div><span class="icon"><span><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="icn common">
      <path d="M6.25 2.75H4.25C3.42157 2.75 2.75 3.42157 2.75 4.25V11.75C2.75 12.5784 3.42157 13.25 4.25 13.25H11.75C12.5784 13.25 13.25 12.5784 13.25 11.75V9.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
      <path d="M13.25 2.75L7.5 8.5M13.25 2.75H9.25M13.25 2.75V6.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg></span></span><span class="label" tabindex="-1">Publishing...</span></div>`)
    })
  })

  describe("Resuming animation from previous step plays the animation until the end", () => {
    test("Resuming from initial step", () => {
      intersectioObserverMockedObserveValues = {
        boundingClientRect: {},
        intersectionRatio: 1,
        intersectionRect: {},
        isIntersecting: true,
        rootBounds: {},
        time: 0
      }
      const home = new SteppedHomepage(0)
      const title = home.titleContainer as HTMLElement
      title.children[0].dispatchEvent(new Event("animationend"))
      expect(title.children[0].innerHTML).toBe(home.animation.titles[0])
    })

    test("Resuming from second step", () => {
      intersectioObserverMockedObserveValues = {
        boundingClientRect: {},
        intersectionRatio: 1,
        intersectionRect: {},
        isIntersecting: true,
        rootBounds: {},
        time: 0
      }
      const home = new SteppedHomepage(1)
      const title = home.titleContainer as HTMLElement
      title.children[0].dispatchEvent(new Event("animationend"))
      expect(title.children[0].innerHTML).toBe(home.animation.titles[3])
    })

    test("Resuming from last step", () => {
      intersectioObserverMockedObserveValues = {
        boundingClientRect: {},
        intersectionRatio: 1,
        intersectionRect: {},
        isIntersecting: true,
        rootBounds: {},
        time: 0
      }
      const home = new SteppedHomepage(2)
      const title = home.titleContainer as HTMLElement
      title.children[0].dispatchEvent(new Event("animationend"))
      expect(title.children[0].innerHTML).toBe(home.animation.titles[home.animation.titles.length - 1])
    })
  })
})

class SteppedHomepage extends Homepage {
  constructor(step = 0) {
    super()
    this.animation.switches = step
    this.initMainObserver()
    this.initFooterObserver()
  }
}