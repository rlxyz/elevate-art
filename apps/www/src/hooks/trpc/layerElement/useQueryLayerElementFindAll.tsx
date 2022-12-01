/** Prisma Model Types */
type PrismaLayerElementWithTraitElement = PrismaLayerElement & {
  traitElements: PrismaTraitElementWithRule[];
};
type PrismaTraitElementWithRule = PrismaTraitElement & {
  rulesPrimary: PrismaRules[];
  rulesSecondary: PrismaRules[];
};

import { sumBy } from "@elevateart/api/src/utils/object-utils";
/** useQueryLayerElementFindAll */
import { RulesType } from "@elevateart/compiler";
import { LayerElement as PrismaLayerElement, Rules as PrismaRules, TraitElement as PrismaTraitElement } from "@elevateart/db";
import { useRouter } from "next/router";
import useRepositoryStore from "src/hooks/store/useRepositoryStore";
import { getImageForTrait } from "src/utils/image";
import { trpc } from "src/utils/trpc";

/**
 * Wrapper around Prisma Model for this application. It extends the Prisma Model
 * with additional properties.
 */
export type TraitElementWithImage = PrismaTraitElement & {
  imageUrl: string | undefined;
}; // @todo remove completely
export type Rules = PrismaRules & { condition: RulesType }; // @todo use Prisma enums instead for RulesType...
export type LayerElement = PrismaLayerElement & {
  traitElements: TraitElement[];
};
export type TraitElement = TraitElementWithImage & {
  rulesPrimary: Rules[];
  rulesSecondary: Rules[];
};

export const useQueryLayerElementFindAll = () => {
  const router = useRouter();
  const layerName = router.query.layer;
  const repositoryId = useRepositoryStore((state) => state.repositoryId);
  const { data: layers, isLoading, isError } = trpc.layerElement.findAll.useQuery({ repositoryId }, { enabled: !!repositoryId });

  if (!layers)
    return {
      current: undefined,
      all: [],
      isLoading,
      isError,
    };

  const current = layers.find((l) => l.name === layerName) || layers[0];

  return {
    current: current && createCurrentLayerElement(current, repositoryId),
    all: createAllLayerElement(layers, repositoryId),
    isLoading,
    isError,
  };
};

/**
 * Helper Functions
 * These functions are used to create the current LayerElement by converting to the right data formats.
 *
 * @todo move this to backend
 */
const createCurrentLayerElement = (layerElement: PrismaLayerElementWithTraitElement, repositoryId: string): LayerElement => ({
  ...layerElement,
  traitElements: [createTraitElementNone(layerElement), ...layerElement.traitElements.map((x) => createTraitElement(x, repositoryId))],
});

const createAllLayerElement = (layerElements: PrismaLayerElementWithTraitElement[], repositoryId: string): LayerElement[] =>
  layerElements
    .map((x) => ({
      ...x,
      traitElements: [...x.traitElements.map((x) => createTraitElement(x, repositoryId)), createTraitElementNone(x)],
    }))
    .sort((a, b) => a.priority - b.priority);

const createTraitElementNone = (current: PrismaLayerElementWithTraitElement): TraitElement => ({
  id: `none-${current.id}`,
  name: "None",
  readonly: true,
  weight: 100 - sumBy(current.traitElements || 0, (x) => x.weight),
  createdAt: current.createdAt,
  updatedAt: current.updatedAt,
  layerElementId: current.id,
  rulesPrimary: [],
  rulesSecondary: [],
  imageUrl: undefined,
});

const createTraitElement = (traitElement: PrismaTraitElementWithRule, repositoryId: string): TraitElement => ({
  ...traitElement,
  imageUrl: getImageForTrait({
    r: repositoryId,
    l: traitElement.layerElementId,
    t: traitElement.id,
  }),
  rulesPrimary: traitElement.rulesPrimary.map((r) => ({
    ...r,
    condition: r.condition as RulesType,
  })),
  rulesSecondary: traitElement.rulesSecondary.map((r) => ({
    ...r,
    condition: r.condition as RulesType,
  })),
});
