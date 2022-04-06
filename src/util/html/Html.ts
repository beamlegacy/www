import { createHtmlTaggedTemplate, TemplateFunction } from "util/html/Template"

export interface DomConfig {
  window: Window

  Node: typeof Node

  HTMLElement: typeof HTMLElement

  NodeFilter: typeof NodeFilter
}

const win = globalThis.window || globalThis

export const globalDom: DomConfig = {
  window: win,
  Node: win.Node,
  HTMLElement: win.HTMLElement,
  NodeFilter: win.NodeFilter
}

// eslint-disable-next-line no-var
export let html: TemplateFunction
(function () {
  if (typeof window !== "undefined") {
    html = createHtmlTaggedTemplate(globalDom)
  }
}())
