import Headroom from "headroom.js"

export class Header {

  private el: HTMLElement | null
  private elNav: HTMLElement | null = null
  private elNavMenu: HTMLElement | null = null
  private elMobileButton: HTMLElement | null = null

  private elFocus: HTMLElement | null = null
  private onFocusOut: any

  constructor() {
    this.el = document.querySelector("header")
    this.init()
  }

  private init(): void {
    const self = this

    if (this.el !== null) {
      const elHeader = this.el,
            headroom = new Headroom(elHeader, {
              offset: {
                up: 100,
                down: 5
              },
              tolerance: {
                up: 5,
                down: 0
              },
              classes: {
                initial: "header--fixed",
                pinned: "slideDown",
                unpinned: "slideUp",
                top: "top",
                notTop: "not-top"
              },
              onUnpin: function() {
                self.toggleMobileMenu(true)
              }
            })

      headroom.init()

      window.addEventListener("scroll", () => {
        if (window.pageYOffset === 0) {
          elHeader.classList.remove("slideDown")
          self.toggleMobileMenu(true)
        }
      })

      this.elNav = this.el.querySelector(".nav")
      this.elNavMenu = this.el.querySelector(".nav-menu")

      if (this.elNav) {
        this.elMobileButton = this.elNav.querySelector(".mobile-button")

        if (this.elMobileButton &&  this.elNavMenu) {
          this.elMobileButton.addEventListener("click", () => { 
            self.toggleMobileMenu()
          }, false)
        }
      }
    }
  }

  public get(): HTMLElement | null {
    return this.el
  }

  private toggleMobileMenu(forceClose: boolean = false): void {
    if (this.elNav) {
      if (typeof forceClose === "undefined" || forceClose === false) {
        if (this.elNav.classList.contains("is-open")) {
          this.elNav.classList.add("is-closing")
          this.destroyFocus()
        } else if (!this.onFocusOut) {
          this.elNav.classList.add("is-open")
          this.createFocus()
        }
      } else if (forceClose === true) {
        if (this.elNav.classList.contains("is-open")) {
          this.elNav.classList.add("is-closing")
          this.destroyFocus()
        }
      }
    }
  }

  private destroyFocus(): void {
    const self = this

    if (this.elNavMenu) {
      setTimeout(function() {
        if (self.elNav) {
          self.elNav.classList.remove("is-open")
          self.elNav.classList.remove("is-closing")
        }

        self.onFocusOut = null
      }, 150)

     this.elNavMenu.removeAttribute("tabindex")
   }
  }

  private createFocus(): void {
    const self = this

    if (this.elNavMenu) {
      this.elNavMenu.setAttribute("tabindex", "0")
      this.elNavMenu.focus()

      this.onFocusOut = function(e: any) {
        if (!e.relatedTarget) {
          self.toggleMobileMenu(true)
        }
      }

      this.elNavMenu.addEventListener("focusout", this.onFocusOut, false)

    }
  }

}
