import {GoogleAnalytics} from "util/GoogleAnalytics"
import {Footer} from "./Footer"

describe("Footer", () => {
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
  <header class="headroom headroom--pinned headroom--unpinned">
    <span class="beam-logo">
      <%= htmlWebpackPlugin.options.svg.logoBeam %>
      beam
      <span class="beta">beta</span>
    </span>

    <div class="nav">
      <% if (htmlWebpackPlugin.options.featureFlagEnabled("download beta app")) { %>
        <ul class="listMenu">
        <% for (const nav of htmlWebpackPlugin.options.messages.header.nav) { %>
          <li><a class="underline" href="#"><%= nav.title %></a></li>
        <% } %>
        </ul>
        <button class="btn--flash">
          <%= htmlWebpackPlugin.options.messages.header.downloadBeam %>
        </button>
      <% } else { %>
        <div class="beta-signup">
          <button class="button underline">
            <%= htmlWebpackPlugin.options.messages.header.betaSignup %>
          </button>
          <form class="input" novalidate>
            <input type="email" required name="zXmAeBqfd" autocomplete="off" placeholder="<%= htmlWebpackPlugin.options.messages.header.betaSignupPlaceholder %>">
            <div class="action-container">
              <button type="button" class="button-close" tabindex="0">×</button>
              <button type="submit" class="button-arrow" tabindex="0">-></button>
            </div>
          </form>
          <div class="output"></div>
        </div>
      <% } %>
    </div>
  </header>
  <main>
    <div class="hero">
      <h1><%= htmlWebpackPlugin.options.messages.title %></h1>
      <p><%= htmlWebpackPlugin.options.messages.subtitle %></p>
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
          unobserve
        }
      }
    )
  })

  beforeEach(() => {
    resetContent()
  })

  afterEach(() => {
    document.body.innerHTML = ""
  })

  describe("when the user scrolls to bottom", () => {
    test("should fire a google analytics event", () => {
      window.dataLayer = []

      intersectioObserverMockedObserveValues = {
        boundingClientRect: {},
        intersectionRatio: 1,
        intersectionRect: {},
        isIntersecting: false,
        rootBounds: {},
        time: 0
      }

      const footer = new Footer(false)

      footer.addObservation((ratio: number, mapped: number) => {
        if (mapped > 0 && !GoogleAnalytics.eventFired("scroll_bottom")) {
          GoogleAnalytics.trackEvent("scroll_bottom")
        }
      })

      footer.init()

      expect(window.dataLayer[0][0]).toEqual("event")
      expect(window.dataLayer[0][1]).toEqual("scroll_bottom")
    })

    test("should not fire a google analytics event twice", () => {
      window.dataLayer = []

      intersectioObserverMockedObserveValues = {
        boundingClientRect: {},
        intersectionRatio: 1,
        intersectionRect: {},
        isIntersecting: false,
        rootBounds: {},
        time: 0
      }

      const footer = new Footer(false)

      footer.addObservation((ratio: number, mapped: number) => {
        if (mapped > 0 && !GoogleAnalytics.eventFired("scroll_bottom")) {
          GoogleAnalytics.trackEvent("scroll_bottom")
        }
      })
      
      // fire once
      footer.init()
      expect(window.dataLayer.length).toBe(1)

      // should not fire again
      footer.init()
      expect(window.dataLayer.length).toBe(1)
    })
  })
})
