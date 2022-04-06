export class Button {
  protected _content: (string | HTMLElement) = ""
  element: HTMLButtonElement | undefined

  set content(content: (string | HTMLElement)) {
    this._content = content
    this.render()
  }

  render() {
    if (this.element) {
      // empty element
      this.element.innerHTML = ""
    } else {
      // initialize element
      this.element = (document.createElement("button") as HTMLButtonElement)
    }

    console.assert(
      this._content,
      `Button ${this.element} must have a content`
    )
    this.element.append(this._content)

    return this.element
  }
}