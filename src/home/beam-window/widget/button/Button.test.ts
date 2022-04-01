import {Button} from "home/beam-window/widget/button/Button"

describe("button", () => {
  test("Creating a button from scratch", () => {
    const button = new Button()
    const rendered = button.render()
    expect(rendered instanceof HTMLButtonElement).toBe(true)
  })

  test("Creating a button with text content", () => {
    const button = new Button()
    const rendered = button.render()
    button.content = "test"
    expect(rendered instanceof HTMLButtonElement).toBe(true)
    expect(rendered.childNodes[0].nodeType).toBe(Node.TEXT_NODE)
    expect(rendered.textContent).toBe("test")
  })
})