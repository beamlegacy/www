import {Background} from "./../Background"

export class Video {

  private parent: Background
  public el: HTMLVideoElement | null

  constructor(parent: Background) {
    this.parent = parent
    this.el = document.querySelector(".bg-video-particles")
  }

  /**
   * Updates playback speed of video
   */
  public setVideoSpeed(value: string | number): void {
    if (this.el !== null) {
      switch (value) {
        case "fast":
          this.el.playbackRate = 2
          break
        default:
          if (typeof value === "number") {
            this.el.playbackRate = value
          } else {
            this.el.playbackRate = 1
          }
      }

      if (this.el.paused) {
        this.el.play()
      }
    }
  }

  // public update(): void {
  //   // Empty
  // }

}
