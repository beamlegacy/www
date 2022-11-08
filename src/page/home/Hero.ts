import {Transition} from "./hero/Transition"
import {Home} from "./../Home"

export class Hero {

  public el: HTMLElement | null = document.querySelector(".hero")
  public parent: Home
  public transition: Transition

  constructor(parent: Home ) {
    this.parent = parent
    this.transition = new Transition(this)
  }

  public load():void {
    this.transition.load()
  }

}
