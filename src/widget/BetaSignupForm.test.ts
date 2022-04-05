import App from "index"
import SpyInstance = jest.SpyInstance
import fetchMock from "jest-fetch-mock"
import {BetaSignupForm} from "widget/BetaSignupForm"
import {html} from "util/html/Html"

const pages = require("../../pages.js")

function createEvent(type: string, dic: Record<string, any>, target?: any): Event {
  const ev = Object.assign(new Event(type), dic)
  Object.defineProperty(ev, "target", {
    get: () => target
  })
  return ev
}

const newForm = (): BetaSignupForm => {
  const element = html`
    <div class="beta-signup">
      <button class="button underline"><%= htmlWebpackPlugin.options.messages.header.betaSignup %></button>
      <form class="input" novalidate>
        <input type="email" required name="zXmAeBqfd" autocomplete="off" placeholder="<%= htmlWebpackPlugin.options.messages.header.betaSignupPlaceholder %>">
        <div class="action-container">
          <button type="button" class="button-close">×</button>
          <button type="submit" class="button-arrow">-></button>
        </div>
      </form>
      <div class="output"></div>
    </div>
  ` as Element
  document.body.appendChild(element)
  return new BetaSignupForm(element, pages[0].messages)
}
describe("BetaSignupForm", () => {
  let languageGetter: SpyInstance
  let setTimeoutSpy: SpyInstance
  let form: BetaSignupForm
  const originalSetTimeout = window.setTimeout

  // beforeAll(() => {
  //
  //   Object.defineProperty(window, "location", {
  //     value: Object.defineProperties(
  //       {},
  //       {
  //         ...Object.getOwnPropertyDescriptors(window.location),
  //         replace: {
  //           configurable: true,
  //           value: jest.fn(),
  //         }
  //       },
  //     )
  //   })
  // })

  beforeEach(() => {
    setTimeoutSpy = jest.spyOn(window, "setTimeout")
    setTimeoutSpy.mockImplementation(cb => cb() && 1)
    form = newForm()
  })

  afterEach(() => {
    document.body.innerHTML = ""
    setTimeoutSpy.mockRestore()
  })

  test("Expected selectors are returning a valid Element", () => {
    expect(form.betaSignup instanceof Element).toBe(true)
    expect(form.betaSignupInput instanceof Element).toBe(true)
    expect(form.betaSignupButton instanceof Element).toBe(true)
    expect(form.betaSignupCloseButton instanceof Element).toBe(true)
    expect(form.betaSignupForm instanceof Element).toBe(true)
    expect(form.betaSignupInputContainer instanceof Element).toBe(true)
    expect(form.betaSignupOutput instanceof Element).toBe(true)
    expect(form.betaSignupSubmitButton instanceof Element).toBe(true)
  })

  test("Clicking the sign up button reveals the form", () => {
    const button = form.betaSignupButton as HTMLElement
    button?.click()
    expect(form.betaSignup?.classList.contains("show-input")).toBe(true)
  })

  test("Clicking the sign up button focuses the input", () => {
    const button = form.betaSignupButton as HTMLElement
    button?.click()
    expect(document.activeElement).toBe(form.betaSignupInput)
  })

  test("Focusing the input reveals the form", () => {
    const input = form.betaSignupInput as HTMLInputElement
    input.focus()
    const betaSignup = form.betaSignup as HTMLElement
    expect(betaSignup.classList.contains("show-input")).toBe(true)
  })

  test("Clicking the close button blurs from the input container", () => {
    const button = form.betaSignupButton as HTMLElement
    button?.click()
    const buttonClose = form.betaSignupCloseButton as HTMLElement
    buttonClose?.click()
    const container = form.betaSignupInputContainer as HTMLElement
    expect(container?.contains(document.activeElement)).toBe(false)
  })

  test("Blurring from the input container closes the form", () => {
    const button = form.betaSignupButton as HTMLElement
    const container = form.betaSignupInputContainer as HTMLElement
    const betaSignup = form.betaSignup as HTMLElement
    button?.click()
    const active = document.activeElement as HTMLElement
    expect(container.contains(active)).toBe(true)
    active.blur()
    expect(betaSignup.classList.contains("show-input")).toBe(false)
  })

  describe("Inputting valid email", () => {
    const testWithEmail = (email: string): void => {
      test(`Valid email "${email}"`, () => {
        const button = form.betaSignupButton as HTMLElement
        const betaSignup = form.betaSignup as HTMLElement
        const input = form.betaSignupInput as HTMLInputElement
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
        const button = form.betaSignupButton as HTMLElement
        const betaSignup = form.betaSignup as HTMLElement
        const input = form.betaSignupInput as HTMLInputElement
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
      const input = form.betaSignupInput as HTMLInputElement
      const betaSignup = form.betaSignup as HTMLElement
      input.focus()
      expect(betaSignup.classList.contains("show-input")).toBe(true)
      input.dispatchEvent(createEvent("keydown", {key: "Escape"}))
      expect(document.activeElement).not.toBe(input)
      expect(betaSignup.classList.contains("show-input")).toBe(false)
    })

    describe("Pressing return with valid email in the input doesn't trigger error feedback", () => {
      const testWithEmail = (email: string): void => {
        test(`Valid email "${email}"`, () => {
          const input = form.betaSignupInput as HTMLInputElement
          const betaSignup = form.betaSignup as HTMLElement
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
          const input = form.betaSignupInput as HTMLInputElement
          const betaSignup = form.betaSignup as HTMLElement
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
        const button = form.betaSignupButton as HTMLElement
        const input = form.betaSignupInput as HTMLInputElement
        const formEl = form.betaSignupForm as HTMLFormElement
        button?.click()
        input.value = email
        formEl.dispatchEvent(new Event("submit"))
        expect(fetchMock.mock.calls.length).toEqual(2)
        await new Promise(r => originalSetTimeout(r))
        expect(fetchMock.mock.calls.length).toEqual(3)
      })
    }
    testWithEmail("mat@mat")
    testWithEmail("mathieu@beamapp.co")
    testWithEmail("mathieu+test@beamapp.co")
  })

  describe("Response error during submit", () => {
    beforeAll(() => {
      fetchMock.enableMocks()
    })

    beforeEach(() => {
      fetchMock.mockReset()
      fetchMock.mockResponse("", {status: 404})
    })

    const testWithEmail = (email: string): void => {
      test(`Valid email "${email}"`, async () => {
        const button = form.betaSignupButton as HTMLElement
        const input = form.betaSignupInput as HTMLInputElement
        const formEl = form.betaSignupForm as HTMLFormElement
        button?.click()
        input.value = email
        formEl.dispatchEvent(new Event("submit"))
        expect(fetchMock.mock.calls.length).toEqual(2)
        await new Promise(r => originalSetTimeout(r))
        expect(fetchMock.mock.calls.length).toEqual(2)
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
        const button = form.betaSignupButton as HTMLElement
        const input = form.betaSignupInput as HTMLInputElement
        const formEl = form.betaSignupForm as HTMLFormElement
        button?.click()
        input.value = email
        formEl.dispatchEvent(new Event("submit"))
        expect(fetchMock.mock.calls.length).toEqual(0)
      })
    }
    testWithEmail("test")
    testWithEmail("")
    testWithEmail("test@test@test")
  })

  test("Submit button receives focus on mousedown", () => {
    const button = form.betaSignupButton as HTMLElement
    button?.click()
    const submitButton = form.betaSignupSubmitButton as HTMLButtonElement
    submitButton.dispatchEvent(new Event("mousedown"))
    expect(document.activeElement).toBe(submitButton)
  })
})
