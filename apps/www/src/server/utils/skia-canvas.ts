import { Canvas } from 'canvas-constructor/skia'

export const createCanvas = (width: number, height: number) => {
  return new Canvas(width, height)
}
