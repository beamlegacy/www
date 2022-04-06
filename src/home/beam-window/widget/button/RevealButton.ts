export interface RevealButton extends HTMLButtonElement {
  icon: Element | null

  label: string | null

  open: boolean

  content: string | HTMLElement

  element?: HTMLButtonElement

  new(): any

  render(): void
}