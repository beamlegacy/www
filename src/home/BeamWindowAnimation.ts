import {BeamWindow, BeamWindowMode} from "./beam-window/BeamWindow"
import {RevealButton} from "home/beam-window/widget/button/IconWithLabelRevealButton"

// If you want to debug the animation / timeouts of this module, set this to true
const debug = false

export class BeamWindowAnimation {
  private win: BeamWindow
  private clone: BeamWindow | undefined
  switches = 0
  private timeout: ReturnType<typeof setTimeout> | undefined
  private lastReturn?: number
  playing = false
  titles = (window as any).messages?.animation?.titles || [
    "A <br><strong class=\"in\">powerful note</strong> app…",
    "So you can <br><strong class=\"in\">capture</strong> the web…",
    "Make it <br><strong class=\"in\">your own</strong>…",
    "And <br><strong class=\"in\">share it</strong> with the world",
    "<strong class=\"in\">Sign up</strong> <br>for the beta now <span class=\"arrow\">-&gt;</span>",
  ]

  constructor(
    private handleToggleMode?: (newMode: BeamWindowMode) => void,
    private handleCancelAnimation?: () => void,
    private onLastTitleClick?: (e: MouseEvent) => void
  ) {
    this.win = document.querySelector("beam-window") as BeamWindow
    this.win.onNewMode(this.onNewMode)
    this.win.onTabClick(this.onTabClick)
    const next = (e: Event) => {
      if (this.switches < 3) {
        e.stopImmediatePropagation()
        e.preventDefault()
        this.changeTitle(this.titles[Math.min(this.switches, this.titles.length - 1)])
        const delay = 1350
        const now = new Date().getTime()
        let delta = this.lastReturn ? delay - (now - this.lastReturn): delay
        delta = delta > 0 ? delta : delay
        this.cancelAnimation()
        this.timeout = setTimeout(() => {
          this.win.toggleMode()
        }, delta)
        this.lastReturn = new Date().getTime()
      }
    }
    window.addEventListener("keypress", (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "enter" && !e.shiftKey) {
        const target = e.target as HTMLElement
        if (
          target
          && (
            target.contentEditable === "true"
            || target instanceof HTMLInputElement
            || target.classList?.contains("result")
          )
        ) {
          return
        }
        next(e)
      }
    }, true)
    const footerReturn = document.querySelector("footer [data-key]")
    if (footerReturn) {
      footerReturn.addEventListener("click", next)
    }
  }

  cancelAnimation = (): void => {
    this.timeout && clearTimeout(this.timeout)
    this.handleCancelAnimation && this.handleCancelAnimation()
  }

  onNewMode = (mode: BeamWindowMode): void => {
    this.cancelAnimation()
    this.switches++
    if (this.playing) {
      if (mode === BeamWindowMode.writing) {
        this.onWritingMode()
      } else {
        this.onWebMode()
      }
    }
    this.handleToggleMode && this.handleToggleMode(mode)
  }

  onWritingMode = (): void => {
    const {win} = this
    win.captureTarget()
    this.changeTitle()
    if (this.switches > 1) {
      this.returnToJournal()
    }
  }

  private returnToJournal = (): void => {
    debug && console.log("Return to journal", {switches: this.switches, playing: this.playing})
    const {win} = this
    this.rotateBack()
    this.cancelAnimation() // cancel previous animation if any
    const prevSwitches = this.switches
    this.timeout = setTimeout(() => {
      debug && console.log("Return to journal - Timeout 1", {switches: this.switches, playing: this.playing})
      if (win.mode === BeamWindowMode.web) {
        win.url = "writing/journal"
      }
      const newSwitch = this.switches !== prevSwitches

      if (this.switches > 1) {
        // this.updateFooter(" to learn how to beam")
        win.captureTarget()
      }

      if (newSwitch) {
        this.timeout = setTimeout(() => {
          debug && console.log("Return to journal - Timeout 2", {switches: this.switches, playing: this.playing})
          this.switches++
          this.changeTitle()
          this.timeout = setTimeout(() => {
            debug && console.log("Return to journal - Timeout 3", {switches: this.switches, playing: this.playing})
            win.url = "writing/note"
            this.timeout = setTimeout(() => {
              debug && console.log("Return to journal - Timeout 4", {switches: this.switches, playing: this.playing})
              const button = win.querySelector("[is=beam-button-reveal]") as RevealButton
              if (button) {
                button.open = !button.open
                button.dispatchEvent(new FocusEvent("focus"))
                this.timeout = setTimeout(() => {
                  debug && console.log("Return to journal - Timeout 5", {switches: this.switches, playing: this.playing})
                  button.click()
                }, 1000)
              }
            }, 1350)
          }, 1350)
        }, 2000)
      } else {
        debug && console.log("Didn't switch to web before going back to journal", {switches: this.switches, prevSwitches})
      }
    }, 1500)
  }

  rotateBack = (): void => {
    const {win, clone} = this
    clone?.style.setProperty("--tZ", "-1px")
    clone?.style.setProperty("--rotate", "0")
    clone?.style.setProperty("--scale", "0.9")
    clone?.style.setProperty("--opacity", "0.85")
    win.parentElement?.style.setProperty("--rotate", "0")
    win.parentElement?.style.setProperty("--tX", "0")
  }

  private rotate = (): void => {
    const {win, clone} = this
    clone?.style.setProperty("--tZ", "-9em")
    clone?.style.setProperty("--rotate", "0")
    clone?.style.setProperty("--scale", "0.9")
    clone?.style.setProperty("--opacity", "1")
    win.parentElement?.style.setProperty("--rotate", "25deg")
    win.parentElement?.style.setProperty("--tX", "-37%")
  }

  onWebMode = (): void => {
    if (this.switches > 1) {
      this.returnToWeb()
    }
  }

  private returnToWeb = (): void => {
    debug && console.log("Return to web", {switches: this.switches, playing: this.playing})
    let {clone} = this
    const {win} = this
    this.changeTitle()
    this.timeout = setTimeout(() => {
      debug && console.log("Return to web - Timeout 1", {switches: this.switches, playing: this.playing})
      if (win) {
        clone = this.initClone()
        clone.url = "writing/journal"
        win.querySelector(".capture-frame .highlight")?.classList.remove("shoot")

        this.capturePage(win.url, () => {
          debug && console.log("Return to web - Capture page is done", {url: win.url, switches: this.switches, playing: this.playing})
          this.timeout = setTimeout(() => {
            debug && console.log("Return to web - Timeout 2", {switches: this.switches, playing: this.playing})
            this.capturePage(this.getAnotherWebPage(), () => {
              this.timeout = setTimeout(() => {
                debug && console.log("Return to web - Timeout 3", {switches: this.switches, playing: this.playing})
                win.captureTarget()
                this.timeout = setTimeout(() => {
                  debug && console.log("Return to web - Timeout 4", {switches: this.switches, playing: this.playing})
                  this.changeTitle(this.titles[Math.min(this.switches, this.titles.length - 1)])
                  this.returnToJournal()
                }, 250)
              }, 500)
            })

          }, 1000)
        })

      }
    }, 250)
  }

  private initClone(): BeamWindow {
    let {clone} = this
    const {win} = this
    if (clone) {
      clone.remove()
    }
    clone = this.clone = win.cloneNode(true) as BeamWindow
    this.disableContentEditable()
    clone.style.setProperty("position", "absolute")
    clone.style.setProperty("left", "0")
    clone.style.setProperty("right", "0")
    clone.style.setProperty("top", "0")
    clone.style.setProperty("bottom", "0")
    clone.style.setProperty("width", "initial")
    clone.style.setProperty("height", "initial")

    clone.style.setProperty("transform", "translate3d(var(--tX, 0), var(--tY, 0), var(--tZ, 0)) rotateY(var(--rotate, 0)) scale(var(--scale, 1))")
    this.rotateBack()
    win.parentElement?.insertBefore(clone, win)
    return clone
  }

  onTabClick = (): void => {
    const {win} = this
    const selector = win.captureTargetSelector
    if (selector) {
      win.captureTarget(selector)
      if (selector.endsWith(".capture-last")) {
        this.cancelAnimation()
        this.timeout = setTimeout(() => {
          const selector = win.captureTargetSelector
          if (selector && selector.endsWith(".capture-last")) {
            win.shoot()
            this.updateClonedJournal()
            this.cancelAnimation()
            this.timeout = setTimeout(() => {
              win.captureTarget()
              this.timeout = setTimeout(() => {
                win.url = "writing/journal"
              }, 250)
            }, 500)
          }
        }, 1000)
      }
    }
  }

  capturePage = (url = "web/beam-times", done?: () => void): void => {
    const {win} = this
    this.timeout = setTimeout(() => {
      win.captureTarget()
      this.timeout =  setTimeout(() => {
        win.url = url
        this.timeout = setTimeout(() => {
          win.captureTarget(".capture-first")
          this.timeout = setTimeout(() => {
            win.captureTarget(".capture-second")
            this.timeout = setTimeout(() => {
              win.captureTarget(".capture-third")
              this.timeout = setTimeout(() => {
                win.captureTarget(".capture-last")
                this.rotate()
                this.timeout = setTimeout(() => {
                  this.forceCurrentWritingPage("journal") // make sure inserted animations play in background
                  win.shoot()
                  this.updateClonedJournal()
                  this.timeout = setTimeout(() => {
                    done && done()
                  }, 250)
                }, 500)

              }, 600)
            }, 400)
          }, 500)
        }, 250)
      }, 100)
    }, 250)
  }

  /**
   * Update page title when new inner html is different from previous one
   * @param newInnerHtml
   */
  changeTitle = (
    newInnerHtml: string = this.titles[Math.min(this.switches - 1, this.titles.length - 1)],
    immediate = false
  ): void => {
    const oldH1 = document.querySelector(".beam-site .demo .title") as HTMLElement
    const form = oldH1.querySelector("form")
    const lastTitle = newInnerHtml === this.titles[this.titles.length - 1]
    if (!form) {
      const newH1 = document.createElement(oldH1.tagName)
      newH1.classList.add("title")
      newH1.classList.add("in")
      newH1.innerHTML = newInnerHtml
      if (oldH1.innerHTML !== newH1.innerHTML) {
        const h1 = oldH1.cloneNode(true) as HTMLElement // make a clone to cancel previous events
        if (h1) {
          const newTitle = () => {
            h1.removeEventListener("animationend", newTitle)
            h1.replaceWith(newH1)
          }
          const inElements = h1.querySelectorAll(".in") as NodeListOf<HTMLElement>
          inElements.forEach(el => el.classList.remove("in"))
          h1.classList.remove("in")
          h1.classList.add("out")
          h1.addEventListener("animationend", newTitle)
          const replacement = immediate ? newH1 : h1
          if (lastTitle) {
            newH1.classList.add("last")
            if (this.onLastTitleClick) {
              newH1.addEventListener("click", this.onLastTitleClick)
            }
          }
          oldH1.replaceWith(replacement)
        }
      }
    }
  }

  disableContentEditable = (): void => this.clone && (
    this.clone.querySelectorAll("[contenteditable]") as NodeListOf<HTMLElement>
  ).forEach(
    (e: HTMLElement) => e.contentEditable = "false"
  )

  updateClonedJournal = (): void => {
    const journal = this.win.querySelector(".writing .journal")
    const clonedJournal = this.clone?.querySelector(".writing .journal")
    const newClone = journal?.cloneNode(true) as HTMLElement
    newClone.classList.add("current")
    newClone && clonedJournal?.replaceWith(newClone)
    this.disableContentEditable()
  }

  forcePage = (selectors: string[], page: string): void => {
    selectors.forEach(selector => {
      // Force updating the web view to beam-times in background so next transition is smoother
      const collection = this.win.querySelectorAll(selector) as NodeListOf<HTMLElement>
      collection.forEach(t => {
        if (t.dataset.page === page) {
          t.classList.add("current")
        } else {
          t.classList.remove("current")
        }
      })
    })
  }

  forceCurrentWritingPage = (page: string): void => {
    const selectors = [".beam-window .tabs-writing > .tab", ".beam-window .content .writing [data-page]"]
    this.forcePage(selectors, page)
  }

  getAnotherWebPage = (): string => {
    const webPages = this.win.querySelectorAll(".html-doc[data-page]") as NodeListOf<HTMLElement>
    const randomPage = Array.from(webPages).filter(page => this.win.url !== `web/${page.dataset.page}`)[~~(Math.random() * webPages.length - 1)]
    return `web/${randomPage.dataset.page}`
  }
}