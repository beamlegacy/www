const Language = require('./../../../lang/fr')

class fr extends Language {

  // Needs translating
  title = "Meet the bright web"
  titleHtml = `Meet the <strong class="glowtext">bright web</strong>`
  subtitle = "Browse.  Capture.  Write.  Publish."
  taglineHtml = `A <s>browser</s> new type of software <br/>for <s>searching</s> healthy thinking on the internet.`
  download = "Download"
  downloadSuccess = "Enjoy!"
  macOSVersion = "for macOS 11.3+"

}

module.exports = fr;
