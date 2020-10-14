import { timeline, styler, tween } from "popmotion";
import { random, wait } from "./helpers";

const INITIALIZE_TEXT = "Beam is where ideas take shape";
const SUCCESS_TEXT = "Thank you";
const ERROR_TEXT = "Something went wrong...";

const TYPING_SPEED_MIN = 50;
const TYPING_SPEED_MAX = 150;

const ERASING_SPEED_MIN = 20;
const ERASING_SPEED_MAX = 60;

const INITIALIZE_DELAY = 1000;
const ANIMATIONS_DURATION = 500;

const CAMPAIGN_MONITOR_CM = "cm-ykdjjuh-ykdjjuh";
const CAMPAIGN_MONITOR_ID =
  "2BE4EF332AA2E32596E38B640E90561943B7209F892F8B9FEEDA29EC0ADCD1A97FB4D140E71DAED8BD8055A91B5C943EF17A6DA263A0A43CA53C175E28C9C6CF";

const CARET_BLINK_CLASS_NAME = "is-blinking";

const headerEl = document.querySelector(".header");
const headingEl = document.querySelector(".heading");
const titleEl = document.querySelector(".heading-title");
const caretEl = document.querySelector(".heading-caret");
const joinButtonEl = document.querySelector(".join-button");
const signUpButtonEl = document.querySelector(".sign-up-button");
const descriptionEl = document.querySelector(".description");
const footerEl = document.querySelector(".footer");
const formEl = document.querySelector("form");
const inputEl = document.querySelector(".header-input");
const descriptionStyler = styler(descriptionEl);
const joinButtonStyler = styler(joinButtonEl);
const signUpButtonStyler = styler(signUpButtonEl);
const footerStyler = styler(footerEl);
const inputStyler = styler(inputEl);
const headingStyler = styler(headingEl);

const cloneEl = titleEl.cloneNode(true);
cloneEl.style.whiteSpace = "pre";

const measureLine = (value) => {
  cloneEl.innerHTML = value;

  const container = document.createElement("div");
  container.style.display = "inline-block";
  container.style.position = "absolute";
  container.style.zIndex = -1;
  container.style.visibility = "hidden";

  container.appendChild(cloneEl);

  document.body.appendChild(container);
  const rect = container.getBoundingClientRect();

  container.parentNode.removeChild(container);

  return rect;
};

// Fix header height to prevent sibling elements from overlapping.
headerEl.style.opacity = 0;
titleEl.innerHTML = INITIALIZE_TEXT;
const headerHeight = headerEl.getBoundingClientRect().height;
headerEl.style.height = `${headerHeight}px`;
titleEl.innerHTML = "";
headerEl.style.opacity = 1;

// Compute required data for the typing effect.
const maxWidth = titleEl.getBoundingClientRect().width;
const lineHeight = measureLine(INITIALIZE_TEXT).height;

// Set up caret.
caretEl.style.height = `${lineHeight}px`;
caretEl.classList.add(CARET_BLINK_CLASS_NAME);

// Store typing states. So that we can rewind them for the erasing effect.
const _previousStates = [];
let _linesCount = 0;
let _isTyping = false;
let _currentLine = "";

let _timeout;
const stop = () => clearTimeout(_timeout);

const type = (text) => {
  return new Promise((resolve) => {
    const parts = text.split("");

    const tick = () => {
      stop();

      const part = parts.shift();

      if (!part) {
        stopTyping();
        return resolve();
      }

      startTyping();

      typeChar(part);
      _timeout = setTimeout(tick, random(TYPING_SPEED_MIN, TYPING_SPEED_MAX));
    };

    tick();
  });
};

const typeChar = (char) => {
  _previousStates.push({
    innerHtml: titleEl.innerHTML,
    caretTop: caretEl.style.top,
    caretLeft: caretEl.style.left,
  });

  const nextValue = _currentLine + char;
  let rect = measureLine(nextValue);

  if (rect.width > maxWidth) {
    const words = nextValue.split(" ");
    _currentLine = words.pop();
    _linesCount++;

    cloneEl.innerHTML = _currentLine;
    rect = measureLine(_currentLine);
  } else {
    _currentLine = nextValue;
  }

  const top = _linesCount * lineHeight;
  const left = rect.width;

  caretEl.style.top = `${top}px`;
  caretEl.style.left = `${left}px`;

  titleEl.innerHTML += char;
};

const clear = () => {
  _linesCount = 0;
  _currentLine = "";

  return new Promise((resolve) => {
    const tick = () => {
      stop();

      const previousState = _previousStates.pop();
      if (!previousState) {
        stopTyping();
        return resolve();
      }

      startTyping();

      caretEl.style.top = previousState.caretTop;
      caretEl.style.left = previousState.caretLeft;
      titleEl.innerHTML = previousState.innerHtml;

      _timeout = setTimeout(tick, random(ERASING_SPEED_MIN, ERASING_SPEED_MAX));
    };

    tick();
  });
};

const startTyping = () => {
  if (_isTyping) return;
  _isTyping = true;

  caretEl.classList.remove(CARET_BLINK_CLASS_NAME);
};

const stopTyping = () => {
  if (!_isTyping) return;
  _isTyping = false;

  caretEl.classList.add(CARET_BLINK_CLASS_NAME);
};

const initialize = () => {
  wait(INITIALIZE_DELAY)
    .then(() => type(INITIALIZE_TEXT))
    .then(() => wait(ANIMATIONS_DURATION))
    .then(() => {
      timeline([
        {
          track: "descriptions",
          from: 0,
          to: 1,
          duration: ANIMATIONS_DURATION,
        },
        { track: "join", from: 0, to: 1, duration: ANIMATIONS_DURATION },
        { track: "footer", from: 0, to: 1, duration: ANIMATIONS_DURATION },
      ]).start((v) => {
        joinButtonStyler.set({ y: (1 - v.join) * 20, opacity: v.join });
        descriptionStyler.set({
          y: (1 - v.descriptions) * 20,
          opacity: v.descriptions,
        });
        footerStyler.set({ opacity: v.footer });
      });
    });
};

const showForm = () => {
  inputEl.focus();

  clear().then(() => {
    signUpButtonStyler.set({ display: "block" });
    tween({ from: 0, to: 1, duration: ANIMATIONS_DURATION }).start((v) => {
      inputStyler.set({ opacity: v });
      signUpButtonStyler.set({ opacity: v });
    });

    tween({ from: 1, to: 0, duration: ANIMATIONS_DURATION }).start({
      update: (v) => {
        headingStyler.set({ opacity: v });
        joinButtonStyler.set({ opacity: v });
      },
      complete: () => {
        joinButtonStyler.set({ display: "none" });
      },
    });
  });
};

const submitForm = () => {
  const signUpPromise = campaignMotitorSignUp(inputEl.value);
  inputEl.blur();

  tween({ from: 1, to: 0, duration: ANIMATIONS_DURATION }).start((v) => {
    inputStyler.set({ opacity: v });
    signUpButtonStyler.set({ opacity: v });
    joinButtonStyler.set({ opacity: v });
    descriptionStyler.set({ opacity: v });
  });

  tween({ from: 0, to: 1, duration: ANIMATIONS_DURATION }).start({
    update: (v) => {
      headingStyler.set({ opacity: v });
    },
    complete: () => {
      signUpPromise.then(
        () => type(SUCCESS_TEXT),
        () => type(ERROR_TEXT)
      );
    },
  });
};

initialize();

formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  submitForm();
});

joinButtonEl.addEventListener("click", (e) => {
  e.preventDefault();
  showForm();
});

const campaignMotitorSignUp = (email) => {
  return wait(2000);

  return fetch("https://createsend.com//t/getsecuresubscribelink", {
    method: "POST",
    body: new URLSearchParams({
      email,
      data: CAMPAIGN_MONITOR_ID,
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  })
    .then((res) => res.text())
    .then((secureUrl) => {
      return fetch(secureUrl, {
        method: "POST",
        body: new URLSearchParams({
          [CAMPAIGN_MONITOR_CM]: email,
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
      });
    });
};
