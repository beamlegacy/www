export class NumberUtil {
  static clamp(input: number, min: number, max: number): number {
    return input < min ? min : input > max ? max : input
  }

  static map =
    (
      num: number,
      inputMin: number, inputMax: number,
      outputMin = 0, outputMax = 1
    ): number => NumberUtil.clamp(
      outputMin + (
        (num - inputMin) * (outputMax - outputMin)
      ) / (
        inputMax - inputMin
      ),
      outputMin,
      outputMax
    )
}