declare module "generate-colors" {
  export function getColorForString(
    str: string,
    options?: {
      contrast: number;
    }
  ): [number, number, number];
}
