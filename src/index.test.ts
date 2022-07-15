import App from "index"
import DownloadApp from "./util/DownloadApp"
import SpyInstance = jest.SpyInstance

describe("Beam Website App", () => {
  let languageGetter: SpyInstance

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
        <% if (htmlWebpackPlugin.options.featureFlagEnabled("download beta app")) { %>
          <button class="beam-button pulse-on-load download-app" data-from="header">
            <%= htmlWebpackPlugin.options.messages.header.tryBeam %>
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

        <% if (htmlWebpackPlugin.options.featureFlagEnabled("download beta app")) { %>
          <button class="beam-button large download-app" data-from="hero">
            <%= htmlWebpackPlugin.options.messages.download %>
          </button>
          <small class="os-version">
            <%= htmlWebpackPlugin.options.messages.macOSVerion %>
          </small>
        <% } %>
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
  })

  test("Double clicking `beta` in the logo trigger download", () => {
    const app = new App()
    const logo = app.logo as HTMLElement
    const beta = logo.querySelector(".beta") as HTMLElement
    expect(beta).toBeDefined()
    beta.dispatchEvent(new Event("dblclick"))
    expect(window.location.replace).toHaveBeenCalledWith(DownloadApp.getUrl())
  })

  describe("when the user clicks on the header download button", () => {
    test("it should download the app", () => {
      const downloadButton = document.querySelector(".nav .beam-button") as HTMLElement
      expect(downloadButton).toBeDefined()
      downloadButton.dispatchEvent(new Event("click"))
      expect(window.location.replace).toHaveBeenCalledWith(DownloadApp.getUrl())
    })
  })

  describe("when the user clicks on the hero download button", () => {
    test("it should download the app", () => {
      const downloadButton = document.querySelector(".hero .beam-button") as HTMLElement
      expect(downloadButton).toBeDefined()
      downloadButton.dispatchEvent(new Event("click"))
      expect(window.location.replace).toHaveBeenCalledWith(DownloadApp.getUrl())
    })
  })
})
