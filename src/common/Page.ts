import App from "./App"

export default class Page {

  protected app: any

  protected init(): void {
    // Required
  }

  public setApp(app:App): void {
    this.app = app
  }

}
