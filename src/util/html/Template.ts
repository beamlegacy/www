import {DomConfig} from "util/html/Html"

export type TemplateFunction = (strings: TemplateStringsArray, ...args: unknown[]) => Node

function template(
  render: (str: string) => Node,
  wrapper: () => Node,
  neutralNode: () => Node,
  document: typeof window.document,
  ScopedNode: typeof Node,
  ScopedNodeFilter: typeof NodeFilter
): TemplateFunction {
  const Node = ScopedNode
  const NodeFilter = ScopedNodeFilter
  return function (strings: TemplateStringsArray, ...args: unknown[]): Node {
    let string = strings[0]
    const nodes: Node[] = []
    // Insert placeholders at Node positions, cast to string otherwise
    for (let i = 0; i < args.length; i++) {
      const arg = args[i]
      if (arg instanceof Node) {
        string += `<!--beam:${nodes.length}-->`
        nodes.push(arg)
      } else if (Array.isArray(arg)) {
        for (const elem of arg) {
          let fragment
          if (elem instanceof ScopedNode) {
            if (!fragment) {
              string += `<!--beam:${nodes.length}-->`
              fragment = document.createDocumentFragment()
              nodes.push(fragment)
            }
            fragment.appendChild(elem)
          } else {
            string += elem ? elem : ""
            fragment = null
          }
        }
      } else {
        string += arg ? arg : ""
      }
      string += strings[i + 1]
    }
    let root: Node
    if (string) {
      // Render the concatenated string and replace placeholder with nodes
      root = render(string)
      if (nodes.length > 0) {
        // collect placeholder nodes
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_COMMENT)
        let node = walker.nextNode()
        const placeholders: Node[] = []
        while (node) {
          const nodeId = node.nodeValue?.match(/^beam:(\d+)$/)?.[1]
          if (nodeId) {
            const nodeIndex = parseInt(nodeId, 10)
            placeholders[nodeIndex] = node
          }
          node = walker.nextNode()
        }
        // swap placeholders with matching nodes
        for (let i = 0; i < nodes.length; i++) {
          const placeholder = placeholders[i]
          if (placeholder) {
            placeholder.parentNode?.replaceChild(nodes[i], placeholder)
          }
        }
      }
      // single node
      if (root.childNodes.length === 1 && root.firstChild) {
        return root.removeChild(root.firstChild)
      }
      // wrap if document fragment
      if (root.nodeType === 11) {
        const node = wrapper()
        node.appendChild(root)
        return node
      }
    } else {
      root = neutralNode()
    }
    return root
  }
}

export function createHtmlTaggedTemplate(dom: DomConfig): TemplateFunction {
  const window = dom.window
  const templateElement: HTMLTemplateElement = window.document.createElement("template")
  const neutralNode: () => Node = (): Node => window.document.createTextNode("")
  const document: typeof window.document = window.document
  const Node = dom.Node
  const NodeFilter = dom.NodeFilter
  const render = (string: string): Node => {
    templateElement.innerHTML = string
      .replace(/^\s+</, "<")
      .replace(/>\s+$/, ">")
    return document.importNode(templateElement.content, true)
  }
  const wrapper = (): Element => document.createElement("div")
  return template(render, wrapper, neutralNode, document, Node, NodeFilter)
}
