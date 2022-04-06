import {Button} from "home/beam-window/widget/button/Button"

describe("button", () => {
  test("Creating a button from scratch", () => {
    const button = new Button()
    const rendered = button.render()
    expect(rendered instanceof HTMLButtonElement).toBe(true)
  })

  test("Creating a button with text content", () => {
    const button = new Button()
    button.content = "test"
    const rendered = button.render()
    expect(rendered instanceof HTMLButtonElement).toBe(true)
    expect(rendered.childNodes[0].nodeType).toBe(Node.TEXT_NODE)
    expect(rendered.textContent).toBe("test")
  })

  test("Creating a button with HTMLElement content", () => {
    const button = new Button()
    const span = document.createElement("span")
    span.textContent = "test"
    button.content = span
    const rendered = button.render()
    expect(rendered instanceof HTMLButtonElement).toBe(true)
    const childNode = rendered.childNodes[0] as HTMLElement
    expect(childNode.nodeType).toBe(Node.ELEMENT_NODE)
    expect(childNode.tagName.toLowerCase()).toBe("span")
    expect(rendered.textContent).toBe("test")
  })
})