import {Icon} from "home/beam-window/widget/icons/Icon"

const icon = {
  common: `
      <svg class="checkmark" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 7.5L6.5 12.5L13.5 2.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `
}

export class IconCheckmark extends Icon {
  constructor() {
    super(icon)
  }
}