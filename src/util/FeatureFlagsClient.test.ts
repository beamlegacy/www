import FeatureFlagsClient from "util/FeatureFlagsClient"

describe("FeatureFlagsClient", () => {
  beforeAll(() => {
    process.env = {
      "FEATURE_DOWNLOAD_BETA_APP": "true"
    }
  })
  describe("when the feature is enabled", () => {
    test("should return true", () => {
      expect(FeatureFlagsClient.isEnabled("download beta app")).toBe(true)
    })
  })
  describe("when the feature is disabled", () => {
    test("should return false", () => {
      expect(FeatureFlagsClient.isEnabled("do something disabled")).toBe(false)
    })
  })
})