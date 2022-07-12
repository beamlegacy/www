import {GoogleAnalytics} from "util/GoogleAnalytics"

describe("GoogleAnalytics", () => {
  beforeEach(() => {
    window.dataLayer = []
  })
  test("should track a custom event", () => {
    GoogleAnalytics.trackEvent("test", {
      test: "Test message"
    })
    expect(window.dataLayer![0][0]).toBe("event")
    expect(window.dataLayer![0][1]).toBe("test")
    expect(window.dataLayer![0][2]).toEqual({test: "Test message"})
  })
  test("should list all events", () => {
    GoogleAnalytics.trackEvent("test", {
      test: "Test message"
    })
    expect(GoogleAnalytics.listEvents()[0][0]).toBe("event")
    expect(GoogleAnalytics.listEvents()[0][1]).toBe("test")
    expect(GoogleAnalytics.listEvents()[0][2]).toEqual({test: "Test message"})
  })
  test("should return if an event has been fired", () => {
    expect(GoogleAnalytics.eventFired("test")).toBe(false)
    GoogleAnalytics.trackEvent("test", {
      test: "Test message"
    })
    expect(GoogleAnalytics.eventFired("test")).toBe(true)
  })
})