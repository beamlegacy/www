import {Video} from "./background/Video"
import {Home} from "./../Home"
import {gsap} from "gsap"
import {ScrollTrigger} from "gsap/dist/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export class Background {

  public el: HTMLElement = document.querySelector(".background") as HTMLElement
  public elLight: HTMLElement = document.querySelector(".bg-lightsource") as HTMLElement
  public elParticles: HTMLElement = document.querySelector(".bg-video-particles") as HTMLElement
  public elGradient: HTMLElement = document.querySelector(".bg-gradient") as HTMLElement
  public parent: Home
  public video: Video = new Video(this)

  constructor(parent: Home) {
    this.parent = parent

    this.bind()
  }

  protected bind(): void {
    const elFeatureVideo = document.querySelector(".feature-video") as HTMLElement,
          elFeatureMore = document.querySelector(".feature-somuchmore") as HTMLElement

    if (this.elLight && this.elParticles) {
      gsap.set(this.elLight, {
        opacity: 1
      })

      gsap.set(this.elParticles, {
        opacity: 0.15
      })
    }

    if (elFeatureVideo && this.elGradient) {
      gsap.timeline({
        scrollTrigger: {
          trigger: elFeatureVideo,
          pin: false,
          start: "-100%",
          end: "0%",
          scrub: 0.01,
          pinSpacing: false
        },
        defaults: {
          ease: "power3"
        }
      }).to(
        this.elGradient,
        {
          opacity: 0
        },
        0
      )
    }

    if (elFeatureVideo && this.elLight) {
      gsap.timeline({
        scrollTrigger: {
          trigger: elFeatureVideo,
          pin: false,
          start: "-50%",
          end: "bottom",
          scrub: 0.01,
          pinSpacing: false
        },
        defaults: {
          ease: "power3"
        }
      }).to(
        this.elLight,
        {
          opacity: 0
        },
        0
      )
    }


    if (elFeatureVideo && this.elGradient) {
      gsap.timeline({
        scrollTrigger: {
          trigger: elFeatureVideo,
          pin: false,
          start: "bottom",
          end: "150%",
          scrub: 0.01,
          pinSpacing: false
        },
        defaults: {
          ease: "power3"
        }
      }).to(
        this.elGradient,
        {
          opacity: 0.1
        },
        0
      )
    }

    if (elFeatureVideo && this.elParticles) {
      gsap.timeline({
        scrollTrigger: {
          trigger: elFeatureVideo,
          pin: false,
          start: "-75%",
          end: "0%",
          scrub: 0.01
        },
        defaults: {
          ease: "power3"
        }
      }).to(
        this.elParticles,
        {
          opacity: 0
        },
        0
      )
    }

    if (elFeatureVideo && this.elLight && this.elParticles && this.elGradient) {
      gsap.timeline({
        scrollTrigger: {
          trigger: elFeatureMore,
          pin: false,
          start: "+=100% bottom",
          scrub: 0.01,
          pinSpacing: false
        },
        defaults: {
          ease: "power3"
        }
      }).to(
        this.elLight,
        {
          opacity: 0.3
        },
        0
      ).to(
        this.elParticles,
        {
          opacity: 0.05
        },
        0
      ).to(
        this.elGradient,
        {
          opacity: 0
        },
        0
      )
    }
  }

  protected update(): void {
    const adjusted = document.documentElement.scrollTop / (document.body.scrollHeight * 0.75)

    document.body.style.setProperty("--gradient-opacity", `${0.15 + adjusted * 0.01}`)
    document.body.style.setProperty("--gradient-grow", `${adjusted * 5}%`)
  }

}
