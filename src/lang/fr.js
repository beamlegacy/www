const Language = require('./en')

class fr extends Language {

  constructor(metas, header, footer) {
    super(metas, header, footer)

    // Needs translating
    this.metas.title = "Bienvenue sur beam"
    this.metas.description = "Browse. Capture. Write. Publish – Meet the bright web"
    this.metas.ogTitle = "Meet the bright web – beam"
    this.metas.ogDescription = "Browse. Capture. Write. Publish – Coming soon to macOS. Join the beta now.",
    this.metas.twitterTitle = "Meet the bright web – beam"

    // Needs translating
    this.header.downloadBeam = "Download Beam"

    // Needs translating (right value should be FR)
    this.translateFromArray(this.header.nav, "title", {
      "Features": "Features",
      "About": "About",
      "Jobs": "Jobs",
      "Terms": "Terms",
      "Policy": "Policy",
    })

    // Needs translating
    this.footer.jobs = "Jobs"
    this.footer.why = "Why beam?"
    this.footer.support = "Support"
    this.footer.privacyPolicy = "Privacy"
    this.footer.terms = "Terms of Service"
  }
}

module.exports = fr;
