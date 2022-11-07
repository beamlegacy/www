export class Encryptor {

  private element: HTMLElement
  private originalText: string
  private places: Array<any>
  private currentText: Array<any>
  private count: number
  private delay: number
  private iteration: number
  private startTime: Date

  constructor(el: HTMLElement, count: number, delay: number) {
    this.element = el
    this.originalText = el.textContent || el.innerText || ""
    this.places = []
    this.currentText = []
    this.count = count || 10 // iterations before fixing a character
    this.delay = delay || 10 // milliseconds between updates
    this.iteration = 0
    this.startTime = new Date()

    let i = this.originalText.length

    while (i--) {
      this.places[i] = [i]
    }
  }

  protected encrypt(): void {
    const charSet = "ABDFGHIJKLMNPQRSTUVWXYZabcdefghijklmnpqrstuvwxyz123456789+=!@#$%^&<>±»¿ƧƩ∀∃∅∆∇∉∋⍵/"
    let i = this.places.length

    while (i--) {
      this.currentText[this.places[i]] = charSet.charAt(
        (Math.random() * charSet.length) | 0
      )
    }
    this.iteration += 1
  }

  protected setContent(): void {
    const t = this.currentText.join("")

    if (typeof this.element.textContent == "string") {
      this.element.textContent = t
    } else {
      this.element.innerText = t
    }
  }

  public run(): void {
    let n

    // If first run, encrypt to initiate
    if (!this.iteration) {
      this.encrypt()
    }

    // If there are places left
    if (this.places.length) {
      // If reached count, randomly remove one place and set its character
      // to the original value
      if (!(this.iteration % this.count)) {
        n = this.places.splice((Math.random() * this.places.length) | 0, 1)[0]
        this.currentText[n] = this.originalText.charAt(n)
      }

      // Randomize the string and call itself
      this.encrypt()
      this.setContent()
      const encryptor = this
      setTimeout(function () {
        encryptor.run()
      }, this.delay)
    }
  }

}