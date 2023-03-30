export default class DownloadApp {
  static getUrl() : string {
    return "https://www.dropbox.com/s/gwliqsubg64oaf1/Beam.dmg?dl=1"
  }

  static startDownload() : void {
    const url = DownloadApp.getUrl()
    window.location.replace(url)
  }
}