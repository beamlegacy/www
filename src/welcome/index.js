import {easing, styler, timeline} from "popmotion"
import {random, wait} from "../helpers"
import logoUrl from "url:../assets/logo.png"

const INITIALIZE_TEXT = "Beam is where ideas take shape"

const TYPING_SPEED_MIN = 50
const TYPING_SPEED_MAX = 150

const INITIALIZE_DELAY = 2500

const ANIMATIONS_DURATION = 800
const ANIMATIONS_Y = 30
// https://cubic-bezier.com/
const ANIMATIONS_EASING = easing.cubicBezier(0.25, 0.1, 0.19, 1.2)

const CARET_BLINK_CLASS_NAME = "is-blinking"

const headerEl = document.querySelector(".header")
const titleEl = document.querySelector(".heading-title")
const caretEl = document.querySelector(".heading-caret")
const joinButtonEl = document.querySelector(".join-button")
const readButtonEl = document.querySelector(".read-button")
const descriptionEl = document.querySelector(".description")
const footerEl = document.querySelector(".footer")
const inputEl = document.querySelector(".header-input")
const descriptionStyler = styler(descriptionEl)
const joinButtonStyler = styler(joinButtonEl)
const footerStyler = styler(footerEl)
const inputStyler = styler(inputEl)

const loadLogo = () => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = resolve
    img.src = logoUrl
  })
}
// Start loading logo as soon as possible.
const loadLogoPromise = loadLogo()

const cloneEl = titleEl.cloneNode(true)
cloneEl.style.whiteSpace = "pre"
const measureLine = (value) => {
  cloneEl.innerHTML = value
  return measureNode(cloneEl)
}

const measureNode = (node) => {
  const container = document.createElement("div")
  container.style.display = "inline-block"
  container.style.position = "absolute"
  container.style.zIndex = -1
  container.style.visibility = "hidden"

  container.appendChild(node)

  document.body.appendChild(container)
  const rect = container.getBoundingClientRect()

  container.parentNode.removeChild(container)

  return rect
}

const fitInputEl = titleEl.cloneNode(true)
fitInputEl.style.whiteSpace = "pre"

// Fix header height to prevent sibling elements from overlapping.
headerEl.style.opacity = 0
titleEl.innerHTML = INITIALIZE_TEXT
const headerHeight = headerEl.getBoundingClientRect().height
headerEl.style.height = `${headerHeight}px`
titleEl.innerHTML = ""
headerEl.style.opacity = 1

// Compute required data for the typing effect.
const maxWidth = titleEl.getBoundingClientRect().width
const lineHeight = measureLine(INITIALIZE_TEXT).height

// Set up caret.
caretEl.style.height = `${lineHeight}px`
caretEl.classList.add(CARET_BLINK_CLASS_NAME)

// Store typing states. So that we can rewind them for the erasing effect.
const _previousStates = []
let _linesCount = 0
let _isTyping = false
let _currentLine = ""

let _timeout
const stop = () => clearTimeout(_timeout)

const type = (text) => {
  return new Promise((resolve) => {
    const parts = text.split("")

    const tick = () => {
      stop()

      const part = parts.shift()

      if (!part) {
        stopTyping()
        return resolve()
      }

      startTyping()

      typeChar(part)
      _timeout = setTimeout(tick, random(TYPING_SPEED_MIN, TYPING_SPEED_MAX))
    }

    tick()
  })
}

const typeChar = (char) => {
  _previousStates.push({
    innerHtml: titleEl.innerHTML,
    caretTop: caretEl.style.top,
    caretLeft: caretEl.style.left,
  })

  const nextValue = _currentLine + char
  let rect = measureLine(nextValue)

  if (rect.width > maxWidth) {
    const words = nextValue.split(" ")
    _currentLine = words.pop()
    _linesCount++

    cloneEl.innerHTML = _currentLine
    rect = measureLine(_currentLine)
  } else {
    _currentLine = nextValue
  }

  const top = _linesCount * lineHeight
  const left = rect.width

  caretEl.style.top = `${top}px`
  caretEl.style.left = `${left}px`

  titleEl.innerHTML += char
}

const startTyping = () => {
  if (_isTyping) return
  _isTyping = true

  caretEl.classList.remove(CARET_BLINK_CLASS_NAME)
}

const stopTyping = () => {
  if (!_isTyping) return
  _isTyping = false

  caretEl.classList.add(CARET_BLINK_CLASS_NAME)
}

const initialize = () => {
  inputStyler.set({zIndex: -100})

  Promise.all([
    loadLogoPromise.then(() => {
      document.body.classList.add("loaded")
    }),
    wait(INITIALIZE_DELAY),
  ])
      .then(() => {
        return type(INITIALIZE_TEXT)
      })
      .then(() => wait(ANIMATIONS_DURATION))
      .then(() => {
        timeline([
          {
            track: "descriptions",
            from: 0,
            to: 1,
            duration: ANIMATIONS_DURATION,
            ease: ANIMATIONS_EASING,
          },
        ]).start((v) => {
          descriptionStyler.set({
            y: (1 - v.descriptions) * ANIMATIONS_Y,
            opacity: v.descriptions,
          })
        })
      })
      .then(() => wait(ANIMATIONS_DURATION * 3))
      .then(() => {
        timeline([
          {
            track: "join",
            from: 0,
            to: 1,
            duration: ANIMATIONS_DURATION,
            ease: ANIMATIONS_EASING,
          },
        ]).start((v) => {
          joinButtonStyler.set({
            y: (1 - v.join) * ANIMATIONS_Y,
            opacity: v.join,
          })
        })
      })
      .then(() => wait(ANIMATIONS_DURATION))
      .then(() => {
        timeline([
          {
            track: "footer",
            from: 0,
            to: 1,
            duration: ANIMATIONS_DURATION,
            ease: ANIMATIONS_EASING,
          },
        ]).start((v) => {
          footerStyler.set({opacity: v.footer})
        })
      })
}

initialize()

readButtonEl.addEventListener("click", (e) => {
  e.preventDefault()
  window.location.href = "https://getonbeam.medium.com/beam-bright-paper-1ca4ae41ae0b"
})
