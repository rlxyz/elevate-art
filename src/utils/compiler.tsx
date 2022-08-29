import seedrandom from 'seedrandom';
import { LayerElement, TraitElement, Rules } from '@prisma/client';


export const compiler = (
  layers: (LayerElement & {
    traitElements: (TraitElement & {
      rulesPrimary: (Rules & {
        primaryTraitElement: TraitElement;
        secondaryTraitElement: TraitElement;
      })[];
      rulesSecondary: (Rules & {
        primaryTraitElement: TraitElement;
        secondaryTraitElement: TraitElement;
      })[];
    })[];
  })[],
  totalSupply: number,
  name: string,
  generation: number
): TraitElement[][] => {
  // sort all layers by priority
  // sort all trait elemnents by weight
  layers
    .sort((a, b) => a.priority - b.priority)
    .forEach(({ traitElements }: LayerElement & { traitElements: TraitElement[]; }) => traitElements.sort((a, b) => a.weight - b.weight)
    );
  const allElements: TraitElement[][] = [];
  for (let i = 0, random = seedrandom(`${name}.${generation}`); i < totalSupply; i++) {
    let elements: TraitElement[] = [];
    layers.forEach(({ traitElements }) => {
      let r = Math.floor(random() * traitElements.reduce((a, b) => a + b.weight, 0));
      traitElements.every((traitElement) => {
        r -= traitElement.weight;
        if (r < 0) {
          elements.push(traitElement);
          return false;
        }
        return true;
      });
    });
    allElements.push(elements);
  }
  return allElements;
};
