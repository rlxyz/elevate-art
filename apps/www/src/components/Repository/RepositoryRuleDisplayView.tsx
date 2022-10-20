import { RulesEnum } from '@elevateart/compiler'
import { TrashIcon } from '@heroicons/react/outline'
import { useMutateRepositoryDeleteRule } from '@hooks/mutations/useMutateRepositoryDeleteRule'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { Rules, TraitElement } from '@prisma/client'
import { trpc } from '@utils/trpc'
import { RulesType } from 'src/types/enums'
import { ComboboxInput } from './RepositoryRuleCombobox'

const TraitRulesDisplayPerItem = ({
  id,
  primary,
  condition,
  secondary,
}: {
  id: string
  primary: TraitElement
  secondary: TraitElement
  condition: RulesType
}) => {
  const { mutate: deleteRule } = useMutateRepositoryDeleteRule()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { data: layers } = trpc.useQuery(['repository.getRepositoryLayers', { id: repositoryId }])
  const primaryLayer = layers?.find((l) => l.traitElements.find((t) => t.id === primary.id))
  const secondaryLayer = layers?.find((l) => l.traitElements.find((t) => t.id === secondary.id))
  return (
    <div className='grid grid-cols-10 space-x-3 text-accents_5'>
      <div className='col-span-3 h-full relative'>
        <ComboboxInput traitElement={primary} layerName={primaryLayer?.name || ''} highlight={false} />
      </div>
      <div className='col-span-2 h-full relative'>
        <div className='w-full h-full rounded-[5px] overflow-hidden border border-border bg-hue-light py-2 pl-3 text-xs'>
          {condition}
        </div>
      </div>
      <div className='col-span-4 h-full relative'>
        <ComboboxInput traitElement={secondary} layerName={secondaryLayer?.name || ''} highlight={false} />
      </div>
      <div className='col-span-1 h-full relative flex items-center right-0 justify-center'>
        <button
          className='w-full flex bg-white disabled:bg-white disabled:text-accents_7 justify-center'
          onClick={() => {
            deleteRule({
              id,
              condition: condition,
              primaryLayerElementId: primary.layerElementId,
              secondaryLayerElementId: secondary.layerElementId,
              primaryTraitElementId: primary.id,
              secondaryTraitElementId: secondary.id,
            })
          }}
        >
          <TrashIcon className='w-4 h-4 text-accents_7' />
        </button>
      </div>
    </div>
  )
}

export const RuleDisplayAll = ({
  traitElements,
}: {
  traitElements: (TraitElement & {
    rulesPrimary: (Rules & {
      primaryTraitElement: TraitElement
      secondaryTraitElement: TraitElement
    })[]
    rulesSecondary: (Rules & {
      primaryTraitElement: TraitElement
      secondaryTraitElement: TraitElement
    })[]
  })[]
}) => {
  return (
    <div className='w-full flex flex-col space-y-2'>
      {traitElements
        .filter(({ rulesPrimary }) => rulesPrimary && rulesPrimary.length)
        .map(
          (
            {
              rulesPrimary,
            }: TraitElement & {
              rulesPrimary: (Rules & {
                primaryTraitElement: TraitElement
                secondaryTraitElement: TraitElement
              })[]
            },
            index
          ) => {
            return (
              <div key={index}>
                {[RulesEnum.enum['cannot mix with'], RulesEnum.enum['only mixes with']].map((ruleType: string, index) => {
                  return (
                    <div className='space-y-2' key={index}>
                      {rulesPrimary
                        .filter((rule) => rule.condition === ruleType)
                        .map((rule, index) => {
                          return (
                            <TraitRulesDisplayPerItem
                              id={rule.id}
                              key={index}
                              primary={rule.primaryTraitElement}
                              condition={rule.condition as RulesType}
                              secondary={rule.secondaryTraitElement}
                            />
                          )
                        })}
                    </div>
                  )
                })}
              </div>
            )
          }
        )}
    </div>
  )
}
