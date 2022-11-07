const FeatureFlagsClient = require('./../util/FeatureFlagsClient')

class Language {

  featureFlagsClient = FeatureFlagsClient;

  constructor(metas, header, footer) {
    if (metas) this.metas = metas;
    if (header) this.header = header;
    if (footer) this.footer = footer;
  }

  /**
   * Searches and updates an array based on an English translation
   * 
   * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
   *
   *   // Example of the original translation value
   * 
   *   > console.log(this.header.nav)
   *
   *     [
   *       {
   *         "title": "Overview",
   *         "url": "https://..."
   *       },
   *       {
   *         "title": "About",
   *         "url": "https://..."
   *       },
   *       ...
   *     ]
   * 
   * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
   *
   *   // Example usage of translating the "title" values from EN to FR
   * 
   *   this.translateFromArray(this.header.nav, "title", {
   *     "Overview": "Vue d'ensemble",
   *     "About": "À propos",
   *     ...
   *   })
   *
   * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
   *
   * @param {Array} obj The translation object to update.
   * @param {string} key The parameter of the item to find and update.
   * @param {object} translations Object of translations.
   */
  translateFromArray(obj, key, translations) {
    for (var i in translations) {
      var item = obj.find(e => e[key] === i);
      if (item && item[key]) {
        item[key] = translations[i];
      }
    }
  }

}

module.exports = Language
