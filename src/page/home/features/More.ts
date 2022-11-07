import {Encryptor} from "./More/Encryptor"

import {gsap} from "gsap"
import {ScrollTrigger} from "gsap/dist/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export class More {

  private el: HTMLElement = document.querySelector(".feature-somuchmore") as HTMLElement

  constructor() {
    this.init()
  }

  private init(): void {
    this.setupAnimation()
    this.setupEncryptor()

    // Browse
    const elBrowse = document.querySelector(".feature-browse .visual .inner") as HTMLElement,
          elBrowseTrigger = document.querySelector(".feature-browse") as HTMLElement

    if (elBrowse && elBrowseTrigger) {
      gsap.set(elBrowse, {
        scale: 0.6
      })

      gsap.to(elBrowse, {
        scale: 1,
        ease: "linear",
        scrollTrigger: {
          trigger: elBrowseTrigger,
          start: "top bottom",
          end: "top middle",
          scrub: 0.8
        }
      })
    }

    // Write
    const elWrite = document.querySelector(".feature-write .visual .inner") as HTMLElement,
          elWriteTrigger = document.querySelector(".feature-write") as HTMLElement

    if (elWrite && elWriteTrigger) {
      gsap.set(elWrite, {
        scale: 0.6
      })

      gsap.to(elWrite, {
        scale: 1,
        ease: "linear",
        scrollTrigger: {
          trigger: elWriteTrigger,
          start: "top bottom",
          end: "+=55%",
          scrub: 0.8
        }
      })
    }

    // Capture
    const elCapture = document.querySelector(".feature-capture .visual") as HTMLElement,
          elCaptureTrigger = document.querySelector(".feature-capture") as HTMLElement

    if (elCapture && elCaptureTrigger) {
      gsap.set(elCapture, {
        scale: 0.6
      })

      gsap.to(elCapture, {
        scale: 1,
        ease: "linear",
        scrollTrigger: {
          trigger: elCaptureTrigger,
          start: "top bottom",
          end: "+=55%",
          scrub: 0.8
        }
      })
    }

    // Capture (Bullets)
    const elCaptureBullets = document.querySelector(".feature-capture .content .bullets") as HTMLElement

    if (elCaptureBullets) {
      gsap.set(elCaptureBullets, {
        opacity: 0,
        yPercent: 50
      })

      gsap.to(elCaptureBullets, {
        yPercent: 0,
        opacity: 1,
        ease: "linear",
        scrollTrigger: {
          trigger: elCaptureBullets,
          start: "top bottom",
          end: "+=20%",
          scrub: 0.8
        }
      })
    }
  }

  private setupAnimation(): void {
    gsap.utils.toArray(".feature-more .more-item").forEach((feature: any) => {
      gsap.set(feature, {
          scale: 0.8
      })

      gsap.to(
        feature, {
          scale: 1,
          ease: "power3",
          scrollTrigger: {
            trigger: feature,
            start: "top bottom",
            end: "top middle",
            scrub: 1
          }
        }
      )
    })

    gsap.utils.toArray(".feature-somuchmore .more-item").forEach((feature: any) => {
      gsap.set(feature, {
        opacity: 0,
          scale: 0.8
      })

      gsap.to(
        feature, {
          opacity: 1,
          scale: 1,
          ease: "power3",
          scrollTrigger: {
            trigger: feature,
            start: "top bottom",
            end: "top middle",
            scrub: 1
          }
        }
      )
    })
  }

  private setupEncryptor(): void {
    const el = document.querySelector(".text-encrypt") as HTMLElement

    if (el) {
      const text = el.innerHTML

      gsap.to(".e2e", {
        ease: "none",
        scrollTrigger: {
          trigger: ".e2e",
          scrub: true,
          onEnter: function() {
            el.innerHTML = text
            const encrypt = new Encryptor(el, 2, 30)
            encrypt.run()
          }
        }
      })
    }
  }
}
