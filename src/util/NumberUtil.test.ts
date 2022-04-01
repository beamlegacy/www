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

  describe("NumberUtil.map: Map a number within an interval to its corresponding value in another interval", () => {
    test("Mapping to another interval", () => {
      expect(NumberUtil.map(0, 0, 1, 0, 10)).toBe(0)
      expect(NumberUtil.map(0.5, 0, 1, 0, 10)).toBe(5)
      expect(NumberUtil.map(1, 0, 1, 0, 10)).toBe(10)
    })

    test("Mapping to the same interval returns the original value", () => {
      expect(NumberUtil.map(0, 0, 1, 0, 1)).toBe(0)
      expect(NumberUtil.map(0.5, 0, 1, 0, 1)).toBe(0.5)
      expect(NumberUtil.map(1, 0, 1, 0, 1)).toBe(1)
    })
  })
})