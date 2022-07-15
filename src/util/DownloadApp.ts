export default class DownloadApp {
  static getUrl() : string {
    return "https://s3.eu-west-3.amazonaws.com/downloads.beamapp.co/beta/Beam.dmg"
  }

  static startDownload() : void {
    const url = DownloadApp.getUrl()
    window.location.replace(url)
  }
}