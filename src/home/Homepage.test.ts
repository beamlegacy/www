import {Homepage} from "home/Homepage"
import SpyInstance = jest.SpyInstance
import {BeamWindow} from "home/beam-window/BeamWindow"
import {testWindowContent} from "home/beam-window/TestWindowContent"
import Mock = jest.Mock
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

    document.body.innerHTML = `
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
})