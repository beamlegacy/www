import {Icon} from "home/beam-window/widget/icons/Icon"

const icon = {
  common: `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.25 2.75H4.25C3.42157 2.75 2.75 3.42157 2.75 4.25V11.75C2.75 12.5784 3.42157 13.25 4.25 13.25H11.75C12.5784 13.25 13.25 12.5784 13.25 11.75V9.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M13.25 2.75L7.5 8.5M13.25 2.75H9.25M13.25 2.75V6.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

export class IconEditorPublish extends Icon {

  constructor() {
    super(icon)
  }
}
