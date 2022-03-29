import {HTML} from "util/html/HtmlUtils"
import {html} from "util/html/Html"

export type IconResponsiveSpec = { desktop: HTML; mobile: HTML}
export type IconFixedSpec = {common: HTML }
export type IconSpec = IconResponsiveSpec | IconFixedSpec

export class Icon {

  element: HTMLElement

  constructor(icon: IconSpec) {
    const icons = Object.keys(icon).map(key => {
      const i = icon as Record<string, HTML>
      const element = html`${i[key]}` as HTMLElement
      element.classList.add("icn", key)
      return element
    })
    this.element = html`<span>${icons}</span>` as HTMLElement
  }
}
