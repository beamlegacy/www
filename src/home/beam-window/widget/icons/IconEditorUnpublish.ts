import {Icon} from "home/beam-window/widget/icons/Icon"

const icon = {
  common: `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 3H4.5C3.67157 3 3 3.67157 3 4.5V11.5C3 12.3284 3.67157 13 4.5 13H11.5C12.3284 13 13 12.3284 13 11.5V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M7.5 8.5L13 3M7.5 8.5H11.5M7.5 8.5V4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

export class IconEditorUnpublish extends Icon {
  constructor() {
    super(icon)
  }
}
