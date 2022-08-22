import { utils } from 'ethers'

import ArtCollection from './Collection'
import { Element } from './Element'
import { Sequencer } from './Sequencer'
import { ImageFormatConfig, LayerConfig } from './types'

// 0v1.0.0
// Every ArtElement is an array of ImageElement
// - each item in the array is indexed to a certain position on the image called PriorityIndex
// Every ".png" file is considered an ImageElement
// - every ImageElement has a FolderSource - pointer to an image url file or folder
// - the FolderSource has a PriorityIndex - the position on the image
// - only a single filder can be chosen in a single FolderSource
// --///--
// Generator -- Aggregator Level. Technically, not important.
//
// Sequencer -- Sequencing Level -- includes Randomizer
//
// Layer -- Element -- Building Block Level -- handles storage (both local & cloud-storage, cid-based structure & folder), handles images (both local & cloud, cid-based structure)
// --///---
//
// Can we standarise metadata querying?
class Connection {}

export class App {
  sequencer: Sequencer
  db: Connection

  constructor({
    configs,
    imageFormat,
    basePath,
  }: {
    configs: LayerConfig[]
    imageFormat: ImageFormatConfig
    basePath: string
  }) {
    this.sequencer = new Sequencer(
      configs,
      basePath,
      imageFormat.width,
      imageFormat.height
    )

    if (imageFormat.height === 0 || imageFormat.width === 0) {
      throw new Error('dimensions invalid')
    }
  }

  createRandomCollection = async (totalSupply: number): Promise<ArtCollection> => {
    const allHash = new Set()
    const tokens = []
    const data = []

    // for mac: sometimes ds_store can cause issues with Number(files[0].file.slice(0, -4))
    const startPoint = 0
    for (let i = startPoint; i < totalSupply + startPoint; ) {
      const element: Element = this.createElementFromRandomness()
      const hash: string = element.toHex()
      const attributes: any[] = element.toAttributes()
      if (!allHash.has(hash)) {
        i++
        allHash.add(hash)
        tokens.push({ attributes: attributes, token_hash: hash })
        data.push(attributes)
      }
    }
    return new ArtCollection({ tokens, data, totalSupply })
  }

  createRandomCollectionFromSeed = (
    seed: number,
    startPoint: number = 0,
    endPoint: number
  ): { tokens: any[]; data: any; totalSupply: number } => {
    const allHash = new Set()
    const tokens = []
    const data = []
    for (let i = startPoint; i < endPoint; ) {
      const element: Element = this.createElementFromHash(
        utils.keccak256(utils.toUtf8Bytes(String((i + 1) * seed)))
      )
      const hash: string = element.toHex()
      const attributes: any[] = element.toAttributes()
      if (!allHash.has(hash)) {
        i++
        allHash.add(hash)
        tokens.push({ attributes: attributes, token_hash: hash })
        data.push(attributes)
      }
    }
    return { tokens, data, totalSupply: endPoint - startPoint }
  }

  createElementFromHash = (tokenHash: string): Element => {
    return this.sequencer.createElement(tokenHash)
  }

  createElementFromRandomness(): Element {
    const hash = utils.keccak256(utils.toUtf8Bytes(String(Math.random())))
    return this.sequencer.createElement(hash)
  }
}
