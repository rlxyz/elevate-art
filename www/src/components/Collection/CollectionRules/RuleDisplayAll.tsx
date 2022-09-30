import Button from '@components/UI/Button'
import { TrashIcon } from '@heroicons/react/outline'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useNotification } from '@hooks/utils/useNotification'
import { LayerElement, Rules, TraitElement } from '@prisma/client'
import { trpc } from '@utils/trpc'
import { RulesEnum } from 'src/types/enums'
import { ComboboxInput } from './ComboboxInput'

export const TraitRulesDisplayPerItem = ({
  id,
  primary,
  condition,
  secondary,
}: {
  id: string
  primary: TraitElement & {
    layerElement: LayerElement
  }
  secondary: TraitElement & {
    layerElement: LayerElement
  }
  condition: string
}) => {
  const { notifySuccess, notifyError } = useNotification()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const ctx = trpc.useContext()
  const mutation = trpc.useMutation('trait.deleteRuleById', {
    onSuccess: (data) => {
      const primaryLayer = data.layers.filter(
        (layer) => layer.id === (data.deletedRule.primaryTraitElement?.layerElement.id || '')
      )[0]
      const secondaryLayer = data.layers.filter(
        (layer) => layer.id === (data.deletedRule.secondaryTraitElement?.layerElement.id || '')
      )[0]
      if (primaryLayer) ctx.setQueryData(['layer.getLayerById', { id: primaryLayer.id }], primaryLayer)
      if (secondaryLayer) ctx.setQueryData(['layer.getLayerById', { id: secondaryLayer.id }], secondaryLayer)
      ctx.setQueryData(['repository.getRepositoryLayers', { id: repositoryId }], data.layers)
      notifySuccess(
        <div>
          <span>{`Removed `}</span>
          <span className='text-blueHighlight text-semibold'>{data?.deletedRule.primaryTraitElement?.name}</span>
          <span className='text-redError'>{` ${data?.deletedRule.condition} `}</span>
          <span className='font-semibold'>{data?.deletedRule.secondaryTraitElement?.name}</span>
        </div>,
        'delete rule'
      )
    },
    onError: () => {
      notifyError('Something went wrong')
    },
  })

  return (
    <div className='grid grid-cols-10 space-x-3 text-darkGrey'>
      <div className='col-span-3 h-full relative'>
        <ComboboxInput traitElement={primary} layerName={primary.layerElement.name} highlight={false} />
      </div>
      <div className='col-span-2 h-full relative'>
        <div className='w-full h-full shadow-sm rounded-[5px] overflow-hidden border border-mediumGrey bg-hue-light py-2 pl-3 text-sm'>
          {condition}
        </div>
      </div>
      <div className='col-span-4 h-full relative'>
        <ComboboxInput traitElement={secondary} layerName={secondary.layerElement.name} highlight={false} />
      </div>
      <div className='col-span-1 h-full relative flex items-center right-0 justify-center'>
        <Button
          variant='icon'
          className='w-full'
          disabled={mutation.isLoading}
          onClick={() => {
            mutation.mutate({ id, repositoryId })
          }}
        >
          <TrashIcon className='w-5 h-5 text-mediumGrey' />
        </Button>
      </div>
    </div>
  )
}

const RuleDisplayAll = ({
  traitElements,
}: {
  traitElements: (TraitElement & {
    rulesPrimary: (Rules & {
      primaryTraitElement: TraitElement & { layerElement: LayerElement }
      secondaryTraitElement: TraitElement & { layerElement: LayerElement }
    })[]
    rulesSecondary: (Rules & {
      primaryTraitElement: TraitElement & { layerElement: LayerElement }
      secondaryTraitElement: TraitElement & { layerElement: LayerElement }
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
                primaryTraitElement: TraitElement & {
                  layerElement: LayerElement
                }
                secondaryTraitElement: TraitElement & {
                  layerElement: LayerElement
                }
              })[]
            },
            index
          ) => {
            return (
              <div key={index}>
                {/* {[RulesEnum.enum['cannot mix with'], RulesEnum.enum['only mixes with']].map( */}
                {[RulesEnum.enum['cannot mix with']].map((ruleType: string, index) => {
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
                              condition={rule.condition}
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

export default RuleDisplayAll
