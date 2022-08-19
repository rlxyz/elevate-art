import sha256 from 'crypto-js/sha256'

import Layer from './Layer'
import { ElementSource } from './types'

export abstract class Element {
  sources: ElementSource[]
  layers: Layer[]
  source: string

  constructor(sources: ElementSource[], layers: Layer[]) {
    this.sources = sources
    this.layers = layers
  }

  public abstract toHex(): string

  public abstract toAttributes(): any[]

  public abstract toBuffer(): Promise<Buffer>

  public abstract toFile(output: string): Promise<void>

  public abstract loadSources(): Promise<any>[]
}

// can i infer the layer index if I always keep it in priority -- what are these issues with this approach?
abstract class ImageElement extends Element {
  width: number // can be inferred from the collection
  height: number // can be inferred from the collection

  constructor(
    sources: ElementSource[],
    width: number,
    height: number,
    layers: Layer[]
  ) {
    super(sources, layers)
    this.width = width
    this.height = height
  }

  toAttributes(): any[] {
    const attributes: any[] = []
    this.layers.forEach((layer: Layer, i) => {
      if (this.sources[i]) {
        attributes.push({
          trait_type: this.layers[this.sources[i].layerIndex].name,
          value: this.sources[i].element.name,
        })
      }
    })
    return attributes
  }

  toHex = (): string => {
    return `0x${sha256(
      this.toAttributes()
        .map((attr) => {
          return `${attr['trait_type']}-${attr['value']}`
        })
        .join('-')
    ).toString()}`
  }
}

export class ArtImageElement extends ImageElement {
  public toFile(_: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
  public toBuffer(): Promise<Buffer> {
    throw new Error('Method not implemented.')
  }
  public loadSources(): Promise<any>[] {
    throw new Error('Method not implemented.')
  }
}
