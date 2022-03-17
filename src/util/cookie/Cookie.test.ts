import { Cookie } from "util/cookie/Cookie"

describe("Cookie", () => {
  afterEach(() => {
    document.cookie = ""
  })

  test("set cookie", () => {
    expect(document.cookie).toBe("")
    Cookie.set("beam-test", "test")
    Cookie.set("beam-test2", "test2")
    expect(document.cookie).toBe("beam-test=test; beam-test2=test2")
  })

  test("get cookie", () => {
    Cookie.set("beam-test", "test")
    Cookie.set("beam-test2", "test2")
    expect(Cookie.get("beam-test")).toBe("test")
    expect(Cookie.get("beam-test2")).toBe("test2")
  })

  test("get non existing cookie", () => {
    Cookie.set("beam-test", "test")
    Cookie.set("beam-test2", "test2")
    expect(Cookie.get("beam-test3")).toBeUndefined()
  })
})
