import DownloadApp from "util/DownloadApp"

describe("DownloadApp", () => {
  beforeAll(() => {
    Object.defineProperty(window, "location", {
      value: Object.defineProperties(
        {},
        {
          ...Object.getOwnPropertyDescriptors(window.location),
          replace: {
            configurable: true,
            value: jest.fn()
          }
        },
      )
    })
  })
  test("should download the app", () => {
    DownloadApp.startDownload()
    expect(window.location.replace).toHaveBeenCalledWith(DownloadApp.getUrl())
  })
})