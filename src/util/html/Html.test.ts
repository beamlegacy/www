import { html } from "util/html/Html"

describe("Html tagged template literal helper", () => {
  test("Simple strings are rendered as text nodes", () => {
    const result = html`Test with a simple string`
    expect(result.nodeType).toBe(Node.TEXT_NODE)
    expect(result.textContent).toBe("Test with a simple string")
  })

  test("Html elements are rendered as nodes", () => {
    const result = html`<p>Test with a simple string</p>`
    expect(result.nodeType).toBe(Node.ELEMENT_NODE)
    expect((result as HTMLElement).tagName.toLowerCase()).toBe("p")
    expect(result.textContent).toBe("Test with a simple string")
  })

  test("Html fragments are wrapped within a single tag", () => {
    const result = html`<p>Test with a simple string</p><p>And test with another one to make it a fragment</p>`
    expect(result.nodeType).toBe(Node.ELEMENT_NODE)
    expect((result as HTMLElement).tagName.toLowerCase()).toBe("div")
    expect(result.childNodes.length).toBe(2)
    expect(Array.from(result.childNodes).every(n => {
      return (n as HTMLElement).tagName.toLowerCase() === "p"
    })).toBe(true)
  })

  test("Using template literal placeholders", () => {
    const one = 1
    const simple = "simple"
    const string = document.createElement("span")
    string.textContent = "string"
    const result = html`<p>Test with ${one} ${simple} ${string}</p>`
    expect(result.nodeType).toBe(Node.ELEMENT_NODE)
    expect((result as HTMLElement).tagName.toLowerCase()).toBe("p")
    expect(result.textContent).toBe("Test with 1 simple string")
  })

  test("Using arrays in placeholders", () => {
    const one = 1
    const simple = "simple"
    const string = document.createElement("span")
    string.textContent = "string"
    const array = [one, " ", simple, " ", string]
    const result = html`<p>Test with ${array}</p>`
    expect(result.nodeType).toBe(Node.ELEMENT_NODE)
    expect((result as HTMLElement).tagName.toLowerCase()).toBe("p")
    expect(result.textContent).toBe("Test with 1 simple string")
  })

  test("Falsy values are ignored", () => {
    const falsies = [false, 0, -0, "", null, undefined]
    const result = html`<p>Test with 1 ${falsies}${false}${0}${-0}${""}${null}${undefined}simple string</p>`
    expect(result.nodeType).toBe(Node.ELEMENT_NODE)
    expect((result as HTMLElement).tagName.toLowerCase()).toBe("p")
    expect(result.textContent).toBe("Test with 1 simple string")
  })

  test("Text nodes are kept as text nodes", () => {
    const node = document.createTextNode("Test with a simple string")
    const result = html`${node}`
    expect(result.nodeType).toBe(Node.TEXT_NODE)
    expect(result.childNodes.length).toBe(0)
    expect(result.textContent).toBe("Test with a simple string")
  })
})