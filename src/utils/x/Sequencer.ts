import { mh3, sfc32 } from '@utils/random'
import { ArtImageElement, Element } from './Element'
import Layer from './Layer'
import { ElementSource, LayerConfig, LayerElement } from './types'

// Only handles the sequencing of Layers to create Elements
// Doesn't handle metadata or other things
export class Sequencer {
  // rarely changes
  header: {
    width: number
    height: number
  }

  // regularly changes
  body: {
    layers: Layer[]
    layersPath: string
  }

  constructor(configs: LayerConfig[], basePath: string, width: number, height: number) {
    if (configs.length === 0) {
      throw new Error('configs failed with length 0')
    }

    const layersPath = `${basePath}/layers`

    this.body = {
      layers: configs.map(
        (config: LayerConfig) => new Layer(config, `${layersPath}/${config.name}`)
      ),
      layersPath: layersPath,
    }
    this.header = {
      width: width,
      height: height,
    }
  }

  createElement = (seed: string): Element => {
    return ImageElementRandomizer.Run(seed, this.body.layers, this.header.width, this.header.height)
  }

  // should move to Layer.ts
  public static layerElementHasCombination(
    layers: Layer[],
    layer: Layer,
    elementName: string,
    sequences: ElementSource[]
  ): boolean {
    if (!layer.combination) {
      return false
    }

    let count = 0
    sequences.forEach((sequence) => {
      const name = Sequencer.getElementName(layers, sequence.layerIndex, sequence.elementIndex)
      if (layer.combination[elementName]?.includes(name)) {
        count++
      }
    })

    if (count != 4) {
      return true
    }

    return false
  }

  private static getElementName = (
    layers: Layer[],
    layerIndex: number,
    elementIndex: number
  ): string => {
    return layers[layerIndex]?.elements[elementIndex]?.name || ''
  }

  public static layerElementHasExclusion(
    layers: Layer[],
    layer: Layer,
    elementName: string,
    sequences: ElementSource[]
  ): boolean {
    if (!layer.exclude) {
      return false
    }
    let skip = false
    sequences.forEach((sequence: ElementSource) => {
      const name = Sequencer.getElementName(layers, sequence.layerIndex, sequence.elementIndex)
      if (layer.exclude[elementName]?.includes(name)) {
        skip = true
      }
    })
    return skip
  }
}

export class ImageElementRandomizer {
  public static Run = (
    seed: string,
    layers: Layer[],
    width: number,
    height: number
  ): ArtImageElement => {
    const sequences: ElementSource[] = []
    const generate_seed = mh3(seed)
    const getRandom = sfc32(generate_seed(), generate_seed(), generate_seed(), generate_seed()) // todo: fix
    layers.forEach((layer: Layer, index: number) => {
      const { weight, iterations, occuranceRate, elements } = layer
      for (let k = 0; k < iterations; k++) {
        if (getRandom() > occuranceRate) {
          continue
        }
        let r = Math.floor(getRandom() * weight)

        elements.forEach((element: LayerElement, index: number) => {
          if (
            Sequencer.layerElementHasExclusion(layers, layer, element.name || '', sequences) ||
            Sequencer.layerElementHasCombination(layers, layer, element.name || '', sequences)
          ) {
            return
          }

          for (let i = 0; i < elements.length; i++) {
            r -= element.weight
            if (r < 0) {
              sequences.push({
                layerIndex: index,
                elementIndex: element.id,
                element: layers
                  .filter((v, i) => i == index)[0]
                  ?.elements.find((e) => e.id == element.id),
              })
              break
            }
          }
        })
      }
    })
    return new ArtImageElement(sequences, width, height, layers)
  }
}
