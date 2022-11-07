import {CardStack} from "./features/CardStack"
import {More} from "./features/More"

export class Features {

  constructor() {
    this.initCardStack()
    this.initVideo()
    this.initCapture()

    new More()
  }

  protected initCardStack(): void {
    const cards = document.getElementsByClassName("card-stack")

    if (cards.length > 0) {
      for (let i = 0; i < cards.length; i++) {
        new CardStack(cards[i] as HTMLElement)
      }
    }
  }

  protected initVideo(): void {
    const container = document.querySelector(".beam-video") as HTMLVideoElement,
          video = document.querySelector(".video-main") as HTMLVideoElement,
          videoButton = document.querySelector(".video-play") as HTMLElement,
          fullscreenButton = document.querySelector(".btn-video-fullscreen") as HTMLElement


    if (videoButton) {
      videoButton.addEventListener("click", () => {
        if (video.paused === true) {
          video.play()
          container.classList.add("is-playing")
        } else {
          video.pause()
          container.classList.remove("is-playing")
        }
      }, false)
    }

    const docFullScreenFuncs = video as HTMLVideoElement & {
      mozRequestFullScreen(): Promise<void>
      webkitRequestFullscreen(): Promise<void>
      webkitEnterFullscreen(): Promise<void>
      msRequestFullscreen(): Promise<void>
    }

    if (fullscreenButton) {
      fullscreenButton.addEventListener("click", () => {
        let found = false

        if (docFullScreenFuncs.requestFullscreen) {
          found = true
          docFullScreenFuncs.requestFullscreen()
        } else if (docFullScreenFuncs.mozRequestFullScreen) { /* Firefox */
          found = true
          docFullScreenFuncs.mozRequestFullScreen()
        } else if (docFullScreenFuncs.webkitEnterFullscreen) { /* Chrome, Safari and Opera */
          found = true
          docFullScreenFuncs.webkitEnterFullscreen()
        } else if (docFullScreenFuncs.msRequestFullscreen) { /* IE/Edge */
          found = true
          docFullScreenFuncs.msRequestFullscreen()
        }

        if (found) {
          video.play()
          container.classList.add("is-playing")
        }
      }, false)
    }

    if (video) {
      video.addEventListener("ended", () => {
        container.classList.remove("is-playing")
        video.currentTime = 0
      }, false)

      video.addEventListener("webkitendfullscreen", function() {
        video.pause()
        container.classList.remove("is-playing")
      })
    }
  }

  protected initCapture(): void {
    const element = document.querySelector(".feature-capture") as HTMLElement

    if (element) {
      const bullets = element.querySelectorAll(".bullet"),
            videos = element.querySelectorAll(".video")

      if (element && bullets && bullets.length > 0) {
        for (let i = 0; i < bullets.length; i++) {
          const bullet = bullets[i] as HTMLElement

          if (bullet) {
            bullet.addEventListener("click", () => {
              Array.from(element.querySelectorAll(".bullet")).forEach(function(el) { 
                el.classList.remove("is-active")
              })
              bullet.classList.add("is-active")

              Array.from(element.querySelectorAll(".video")).forEach(function(el) { 
                el.classList.remove("is-active")
              })

              if (videos && videos[i]) {
                const vid = videos[i].querySelector("video") as HTMLVideoElement

                if (vid && videos[i]) {
                  vid.currentTime = 0
                  videos[i].classList.add("is-active")
                }
              }
            }, false)
          }
        }
      }
    }
  }
}
