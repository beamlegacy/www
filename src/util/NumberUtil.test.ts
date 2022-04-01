import {NumberUtil} from "util/NumberUtil"

describe("NumberUtil", () => {
  describe("NumberUtil.clamp: Constrain a value to an interval", () => {
    test("Clamping a value within bounds returns the same value", () => {
      expect(NumberUtil.clamp(0, 0, 100)).toBe(0)
      expect(NumberUtil.clamp(50, 0, 100)).toBe(50)
      expect(NumberUtil.clamp(100, 0, 100)).toBe(100)
    })

    test("Clamping a value lower than bounds returns the lower boundary", () => {
      expect(NumberUtil.clamp(-10, 0, 100)).toBe(0)
      expect(NumberUtil.clamp(-50, 0, 100)).toBe(0)
      expect(NumberUtil.clamp(-100, 0, 100)).toBe(0)
      expect(NumberUtil.clamp(-Infinity, 0, 100)).toBe(0)
    })

    test("Clamping a value higher than bounds returns the higher boundary", () => {
      expect(NumberUtil.clamp(110, 0, 100)).toBe(100)
      expect(NumberUtil.clamp(150, 0, 100)).toBe(100)
      expect(NumberUtil.clamp(1100, 0, 100)).toBe(100)
      expect(NumberUtil.clamp(Infinity, 0, 100)).toBe(100)
    })
  })

})