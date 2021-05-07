declare module "generate-colors" {
  export type GenerateColorOptions = {
    /**
     * Brightness/value of hue
     * https://en.wikipedia.org/wiki/Brightness
     */
    brightness?: number | ((defaultBrightness: number) => number)
    /**
     * Saturation
     * https://en.wikipedia.org/wiki/Colorfulness
     */
    saturation?: number | ((defaultSaturation: number) => number)
    /**
     * This is the value of brightness of hue
     * https://en.wikipedia.org/wiki/Brightness
     * @deprecated Please use brightness
     */
    contrast?: number
  }
  /**
   * Get a color [r,g,b] for a given string
   * HSV is used for saturation and value/brightness
   * https://en.wikipedia.org/wiki/HSL_and_HSV
   */
  export function getColorForString(
    str: string,
    options?: GenerateColorOptions
  ): [red: number, green: number, blue: number]
  /**
   * Create a cached version of getColorForString
   */
  export function makeGetColorForOptions(
    /**
     * Options applied to each further invocations
     */
    options?: GenerateColorOptions
  ): (str: string) => [red: number, green: number, blue: number]
}
