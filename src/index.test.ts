import App from "index"
import SpyInstance = jest.SpyInstance
import fetchMock from "jest-fetch-mock"

function createEvent(type: string, dic: Record<string, any>, target?: any): Event {
  const ev = Object.assign(new Event(type), dic)
  Object.defineProperty(ev, "target", {
    get: () => target
  })
  return ev
}

describe("Beam Website App", () => {
  let languageGetter: SpyInstance
  let setTimeoutSpy: SpyInstance
  const originalSetTimeout = window.setTimeout

  beforeAll(() => {

    Object.defineProperty(window, "location", {
      value: Object.defineProperties(
        {},
        {
          ...Object.getOwnPropertyDescriptors(window.location),
          replace: {
            configurable: true,
            value: jest.fn(),
          }
        },
      )
    })
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
    languageGetter = jest.spyOn(window.navigator, 'language', 'get')
  })

  afterEach(() => {
    document.body.innerHTML = ""
    setTimeoutSpy.mockRestore()
  })

  test("Setting lang with nf_lang cookie", () => {
    document.cookie = "nf_lang=fr"
    const app = new App()
    expect(app.lang).toBe("fr")
    expect(window.location.replace).toHaveBeenCalled()
  })

  test("Setting lang via navigator.language", () => {
    languageGetter.mockReturnValue('fr')
    const app = new App()
    expect(app.lang).toBe("fr")
    expect(window.location.replace).toHaveBeenCalled()
  })

  test("Expected selectors are returning a valid Element", () => {
    const app = new App()
    expect(app.logo instanceof Element).toBe(true)
    expect(app.betaSignup instanceof Element).toBe(true)
    expect(app.betaSignupInput instanceof Element).toBe(true)
    expect(app.betaSignupButton instanceof Element).toBe(true)
    expect(app.betaSignupCloseButton instanceof Element).toBe(true)
    expect(app.betaSignupForm instanceof Element).toBe(true)
    expect(app.betaSignupInputContainer instanceof Element).toBe(true)
    expect(app.betaSignupOutput instanceof Element).toBe(true)
    expect(app.betaSignupSubmitButton instanceof Element).toBe(true)
  })

  test("Clicking the sign up button reveals the form", () => {
    const app = new App()
    const button = app.betaSignupButton as HTMLElement
    button?.click()
    expect(app.betaSignup?.classList.contains("show-input")).toBe(true)
  })

  test("Clicking the sign up button focuses the input", () => {
    const app = new App()
    const button = app.betaSignupButton as HTMLElement
    button?.click()
    expect(document.activeElement).toBe(app.betaSignupInput)
  })

  test("Focusing the input reveals the form", () => {
    const app = new App()
    const input = app.betaSignupInput as HTMLInputElement
    input.focus()
    const betaSignup = app.betaSignup as HTMLElement
    expect(betaSignup.classList.contains("show-input")).toBe(true)
  })

  test("Clicking the close button blurs from the input container", () => {
    const app = new App()
    const button = app.betaSignupButton as HTMLElement
    button?.click()
    const buttonClose = app.betaSignupCloseButton as HTMLElement
    buttonClose?.click()
    const container = app.betaSignupInputContainer as HTMLElement
    expect(container?.contains(document.activeElement)).toBe(false)
  })

  test("Blurring from the input container closes the form", () => {
    const app = new App()
    const button = app.betaSignupButton as HTMLElement
    const container = app.betaSignupInputContainer as HTMLElement
    const betaSignup = app.betaSignup as HTMLElement
    button?.click()
    const active = document.activeElement as HTMLElement
    expect(container.contains(active)).toBe(true)
    active.blur()
    expect(betaSignup.classList.contains("show-input")).toBe(false)
  })

  describe("Inputting valid email", () => {
    const testWithEmail = (email: string): void => {
      test(`Valid email "${email}"`, () => {
        const app = new App()
        const button = app.betaSignupButton as HTMLElement
        const betaSignup = app.betaSignup as HTMLElement
        const input = app.betaSignupInput as HTMLInputElement
        button?.click()
        input.value = email
        input.dispatchEvent(new Event("input"))
        expect(betaSignup.classList.contains("valid")).toBe(true)
      })
    }
    testWithEmail("mat@mat")
    testWithEmail("mathieu@beamapp.co")
    testWithEmail("mathieu+test@beamapp.co")
  })

  describe("Inputting invalid email", () => {
    const testWithEmail = (email: string): void => {
      test(`Invalid email "${email}"`, () => {
        const app = new App()
        const button = app.betaSignupButton as HTMLElement
        const betaSignup = app.betaSignup as HTMLElement
        const input = app.betaSignupInput as HTMLInputElement
        button?.click()
        input.value = email
        input.dispatchEvent(new Event("input"))
        expect(betaSignup.classList.contains("valid")).toBe(false)
      })
    }
    testWithEmail("test")
    testWithEmail("")
    testWithEmail("test@test@test")
  })

  describe("Keyboard events", () => {
    test("Pressing escape in the input blurs it and closes the form", () => {
      const app = new App()
      const input = app.betaSignupInput as HTMLInputElement
      const betaSignup = app.betaSignup as HTMLElement
      input.focus()
      expect(betaSignup.classList.contains("show-input")).toBe(true)
      input.dispatchEvent(createEvent("keydown", {key: "Escape"}))
      expect(document.activeElement).not.toBe(input)
      expect(betaSignup.classList.contains("show-input")).toBe(false)
    })

    describe("Pressing return with valid email in the input doesn't trigger error feedback", () => {
      const testWithEmail = (email: string): void => {
        test(`Valid email "${email}"`, () => {
          const app = new App()
          const input = app.betaSignupInput as HTMLInputElement
          const betaSignup = app.betaSignup as HTMLElement
          input.focus()
          expect(betaSignup.classList.contains("show-input")).toBe(true)
          input.value = email
          input.dispatchEvent(createEvent("keydown", {key: "enter"}))
          expect(betaSignup.classList.contains("error")).toBe(false)
        })
      }
      testWithEmail("mat@mat")
      testWithEmail("mathieu@beamapp.co")
      testWithEmail("mathieu+test@beamapp.co")
    })

    describe("Pressing return with invalid email in the input triggers error feedback", () => {
      const testWithEmail = (email: string): void => {
        test(`Valid email "${email}"`, () => {
          const app = new App()
          const input = app.betaSignupInput as HTMLInputElement
          const betaSignup = app.betaSignup as HTMLElement
          input.focus()
          expect(betaSignup.classList.contains("show-input")).toBe(true)
          input.value = email
          input.dispatchEvent(createEvent("keydown", {key: "enter"}))
          expect(betaSignup.classList.contains("error")).toBe(true)
        })
      }
      testWithEmail("test")
      testWithEmail("")
      testWithEmail("test@test@test")
    })
  })

  describe("Submitting form with valid email", () => {
    beforeAll(() => {
      fetchMock.enableMocks()
    })

    beforeEach(() => {
      fetchMock.mockReset()
      fetchMock.mockResponse("https://fakeSubscribeUrl.com")
    })

    const testWithEmail = (email: string): void => {
      test(`Valid email "${email}"`, async () => {
        const app = new App()
        const button = app.betaSignupButton as HTMLElement
        const input = app.betaSignupInput as HTMLInputElement
        const form = app.betaSignupForm as HTMLFormElement
        button?.click()
        input.value = email
        form.dispatchEvent(new Event("submit"))
        expect(fetchMock.mock.calls.length).toEqual(2)
        await new Promise(r => originalSetTimeout(r))
        expect(fetchMock.mock.calls.length).toEqual(3)
      })
    }
    testWithEmail("mat@mat")
    testWithEmail("mathieu@beamapp.co")
    testWithEmail("mathieu+test@beamapp.co")
  })

  describe("Submitting form with invalid email doesn't trigger any fetch request", () => {
    beforeAll(() => {
      fetchMock.enableMocks()
      fetchMock.mockResponse("https://fakeSubscribeUrl.com")
    })

    beforeEach(() => {
      fetchMock.mockReset()
    })

    const testWithEmail = (email: string): void => {
      test(`Valid email "${email}"`, async () => {
        const app = new App()
        const button = app.betaSignupButton as HTMLElement
        const input = app.betaSignupInput as HTMLInputElement
        const form = app.betaSignupForm as HTMLFormElement
        button?.click()
        input.value = email
        form.dispatchEvent(new Event("submit"))
        expect(fetchMock.mock.calls.length).toEqual(0)
      })
    }
    testWithEmail("test")
    testWithEmail("")
    testWithEmail("test@test@test")
  })
})
