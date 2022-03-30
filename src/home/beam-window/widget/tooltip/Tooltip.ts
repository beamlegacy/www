import { html } from "util/html/Html"
import { debounce } from "debounce"
import "./tooltip.scss"

/**
 * Tooltip directions, values are the classes we need to apply to the tooltip parent,
 * should you change them, be sure to also update the corresponding css rules in tooltip.css
 */
export enum TooltipDirection {
  top = "tooltip-top",
  bottom = "tooltip-bottom",
  left = "tooltip-left",
  right = "tooltip-right"
}

/**
 * Handle tooltip sizing and positioning
 */
export class Tooltip {
  private animating: boolean
  private readonly defaultPosition: TooltipDirection
  private margin = 10 // margin for tooltip overflow computation
  private isVisible = false

  /**
   * Call on elements to which you did, or will, add `data-tooltip` attribute to,
   * apply any TooltipDirection as a class to the element to set the direction of the tooltip
   * @param element
   */
  constructor(private element: HTMLElement) {
    this.element.classList.add("tooltip-container") // used to measure and reposition tooltips even when not yet defined
    this.defaultPosition = TooltipDirection.top
    if (this.element.classList.contains(TooltipDirection.left)) {
      this.defaultPosition = TooltipDirection.left
    } else if (this.element.classList.contains(TooltipDirection.right)) {
      this.defaultPosition = TooltipDirection.right
    } else if (this.element.classList.contains(TooltipDirection.bottom)) {
      this.defaultPosition = TooltipDirection.bottom
    }
    this.element.classList.add(this.defaultPosition) // make sure the class is always
    this.animating = false
    this.attachEventHandlers()
    const callback = (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        this.isVisible = entry.isIntersecting
      }
    }
    const intersectionObserver = new IntersectionObserver(callback)
    intersectionObserver.observe(this.element)
    setTimeout(() => {
      this.update()
    })
  }

  /**
   * Call this to remove the tooltip events, should you remove the element from the DOM
   * and not plan to attach it back later
   */
  destroy(): void {
    this.animating = false
    this.detachEventListener()
  }

  /**
   * Update tooltip variables and position
   */
  private update = (): void => {
    if (this.element.isConnected) { // make sure the element is within the DOM (whether in nested shadow DOMs or not)
      const style = getComputedStyle(this.element)
      const elementStyle = this.element.style
      elementStyle.setProperty("--tooltip-padding-left", style.getPropertyValue("padding-left"))
      elementStyle.setProperty("--tooltip-padding-right", style.getPropertyValue("padding-right"))
      elementStyle.setProperty("--tooltip-padding-top", style.getPropertyValue("padding-top"))
      elementStyle.setProperty("--tooltip-padding-bottom", style.getPropertyValue("padding-bottom"))
      const rect = this.element.getBoundingClientRect()
      elementStyle.setProperty("--tooltip-parent-width", `${rect.width}px`)
      elementStyle.setProperty("--tooltip-parent-height", `${rect.height}px`)
      this.isVisible && this.repositionTooltip(style, rect)
      if (this.animating) {
        requestAnimationFrame(this.updateDebounced)
      }
    }
  }

  private updateDebounced = debounce(this.update, 1000/60)

  /**
   * Place invisible real element (non pseudo) tooltip for measurement
   * @private
   */
  private measureTooltip(): DOMRect {
    const label = this.element.dataset.tooltip ? this.element.dataset.tooltip : "placeholder"
    const hiddenContainer = html`<span class="visually-hidden"/>`
    const tooltip = html`<span class="tooltip measure">${label}</span>` as HTMLElement
    hiddenContainer.appendChild(tooltip)
    this.element.appendChild(hiddenContainer)
    const rect = tooltip.getBoundingClientRect()
    this.element.removeChild(hiddenContainer)
    return rect
  }

  /**
   * Reposition tooltip in the opposite direction if it doesn't fit in its default position
   * @param containerStyle - the computed style of the container element
   * @param containerRect - the DOMrect for the container element
   */
  private repositionTooltip = (containerStyle: CSSStyleDeclaration, containerRect: DOMRect): void => {
    const headerHeight = this.convertRemToPixels(containerStyle.getPropertyValue("--header-height"))
    const tooltipOffset = this.defaultToZero(parseFloat(containerStyle.getPropertyValue("--tooltip-offset")))
    const rect = this.measureTooltip()
    // Dimension helpers
    const xPosWhenOnRight = () => containerRect.x + containerRect.width + tooltipOffset + rect.width
    const xPosWhenOnLeft = () => containerRect.x - rect.width - tooltipOffset
    const yPosWhenOnBottom = () => containerRect.y + containerRect.height + tooltipOffset + rect.height
    const yPosWhenOnTop = () => containerRect.y - rect.height - tooltipOffset
    const fitsOnRight = () => xPosWhenOnRight() <= window.innerWidth - this.margin
    const fitsOnLeft = () => xPosWhenOnLeft() >= this.margin
    const fitsOnBottom = () => yPosWhenOnBottom() <= window.innerHeight - this.margin
    const fitsOnTop = () => yPosWhenOnTop() > headerHeight + this.margin

    const classList = this.element.classList
    if (classList.contains(TooltipDirection.right)) {
      if (fitsOnLeft() && (this.defaultPosition === TooltipDirection.left || !fitsOnRight())) {
        classList.remove(TooltipDirection.right)
        classList.add(TooltipDirection.left)
      }
      this.element.style.setProperty("--tooltip-horizontal-shift", `${0}px`)
    } else if (classList.contains(TooltipDirection.left)) {
      if (fitsOnRight() && (this.defaultPosition === TooltipDirection.right || !fitsOnLeft())) {
        classList.remove(TooltipDirection.left)
        classList.add(TooltipDirection.right)
      }
      this.element.style.setProperty("--tooltip-horizontal-shift", `${0}px`)
    } else if (classList.contains(TooltipDirection.bottom)) {
      if (fitsOnTop() && (this.defaultPosition === TooltipDirection.top || !fitsOnBottom())) {
        classList.remove(TooltipDirection.bottom)
        classList.add(TooltipDirection.top)
      }
      this.repositionHorizontally(rect)
    } else {
      if (fitsOnBottom() && (this.defaultPosition === TooltipDirection.bottom || !fitsOnTop())) {
        classList.remove(TooltipDirection.top)
        classList.add(TooltipDirection.bottom)
      }
      this.repositionHorizontally(rect)
    }
  }

  private repositionHorizontally = (rect: DOMRect): void => {
    let horizontalShift = 0
    if (rect.x < this.margin) {
      // position to the left of the screen no matter if it overflows on the right (worst case scenario)
      horizontalShift = this.margin - rect.x
    } else if (rect.x + rect.width > window.innerWidth - this.margin) {
      horizontalShift = (window.innerWidth - this.margin) - (rect.x + rect.width)
      // cap horizontal shift so we don't overflow on the left, can overflow on the right if we can't make it fit
      if (rect.x + horizontalShift < this.margin) {
        horizontalShift += this.margin - (rect.x + horizontalShift)
      }
    }
    this.element.style.setProperty("--tooltip-horizontal-shift", `${horizontalShift}px`)
  }

  private attachEventHandlers(): void {
    window.addEventListener("resize", this.update)
    window.addEventListener("scroll", this.updateDebounced, true)
    this.element.addEventListener("mouseenter", this.update)
    this.element.addEventListener("transitionstart", this.animationOrTransitionStart)
    this.element.addEventListener("transitionend", this.animationOrTransitionEnd)
    this.element.addEventListener("animationstart", this.animationOrTransitionStart)
    this.element.addEventListener("animationend", this.animationOrTransitionEnd)
  }

  private detachEventListener(): void {
    window.removeEventListener("resize", this.update)
    window.removeEventListener("scroll", this.updateDebounced, true)
    this.element.removeEventListener("mouseenter", this.update)
    this.element.removeEventListener("transitionstart", this.animationOrTransitionStart)
    this.element.removeEventListener("transitionend", this.animationOrTransitionEnd)
    this.element.removeEventListener("animationstart", this.animationOrTransitionStart)
    this.element.removeEventListener("animationend", this.animationOrTransitionEnd)
  }

  private animationOrTransitionStart = (e: TransitionEvent | AnimationEvent): void => {
    // TODO: support multiple transition / animations
    if (!e.pseudoElement) {
      this.animating = true
      this.update()
    }
  }

  private animationOrTransitionEnd = (e: TransitionEvent | AnimationEvent): void => {
    // TODO: support multiple transition / animations
    if (!e.pseudoElement) {
      this.animating = false
      setTimeout(() => {
        requestAnimationFrame(this.update)
      })
    }
  }

  private convertRemToPixels(rem: string): number {
    const px = parseFloat(rem) * parseFloat(
      getComputedStyle(document.documentElement).fontSize
    )
    return this.defaultToZero(px)
  }

  /**
   * Default non numerical values to 0
   * @param val
   * @private
   */
  private defaultToZero(val: number): number {
    console.assert(!isNaN(val), `Could not convert value \`${val}\` to number, defaulting to 0`)
    return isNaN(val) ? 0 : val
  }
}
