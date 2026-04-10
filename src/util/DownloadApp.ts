export default class DownloadApp {
  static getUrl() : string {
    return "https://github.com/beamlegacy/beam"
  }

  static startDownload() : void {
    const url = DownloadApp.getUrl()
    window.location.replace(url)
  }
}