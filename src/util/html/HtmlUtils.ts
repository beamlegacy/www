export type HTML = string

export class HtmlUtils {
  /**
   * Measure the given html element
   * We use the element offsetWidth and offsetHeight to make sure we get the size without
   * any transforms.
   * Elements are measured by adding them to the document in order to be able to measure early
   * (e.g. before we actually rendered the element we want to measure or it's ancestors)
   * @param element
   */
  static measureHtmlElement(
    element: HTMLElement
  ): {
    width: number,
    height: number
  } {
    const temp = document.createElement("div")
    temp.classList.add("visually-hidden")
    temp.appendChild(element)
    document.body.appendChild(temp)
    const width = element.offsetWidth
    const height = element.offsetHeight
    document.body.removeChild(temp)
    return {width, height}
  }

  // /**
  //  * Sanitize HTML input to be displayed as text
  //  * @param str
  //  */
  // static sanitize(str: string) {
  //   // we can't use the following as the dom engine converts &#60 into named entity &lt;
  //   // and removes the " ' escaping since it's not really necessary
  //   // return str.replace(/[<>&"']/g, (char) => `&#${char.charCodeAt(0)};`)
  //   return str
  //     .replace(/&/g, "&amp;")
  //     .replace(/</g, "&lt;")
  //     .replace(/>/g, "&gt;")
  //     .replace(/"/g, "&quot;")
  //     .replace(/'/g, "&apos;")
  // }
}
