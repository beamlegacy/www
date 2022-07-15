const process = require('process')
if (!process.browser) {
  require("dotenv").config()
}

// The goal of this class if to be generic. In the future, we might want to use github feature flags.
// The reason why we didn't yet is because it requires a lot of extra work on the webpack configuration.
// So at the moment we are using env variables to configure the feature flags.
// This is a js file, since the current webpack configuration only supports js files.
class FeatureFlagsClient {
  static isEnabled(feature) {
    return process.env[`FEATURE_${feature.toUpperCase().replace(/\s+/g, "_")}`] === "true"
  }
}

module.exports = FeatureFlagsClient