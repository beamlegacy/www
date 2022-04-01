import {Button} from "home/beam-window/widget/button/Button"

describe("button", () => {
  test("Creating a button from scratch", () => {
    const button = new Button()
    const rendered = button.render()
    expect(rendered instanceof HTMLButtonElement).toBe(true)
  })
})