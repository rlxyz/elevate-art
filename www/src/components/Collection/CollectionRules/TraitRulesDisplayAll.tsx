import Button from '@components/UI/Button'
import { TrashIcon } from '@heroicons/react/outline'
import { useNotification } from '@hooks/useNotification'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { Rules, TraitElement } from '@prisma/client'
import { trpc } from '@utils/trpc'
import { RulesEnum } from 'src/types/enums'

export const TraitRulesDisplayPerItem = ({
  id,
  primary,
  condition,
  secondary,
}: {
  id: string
  primary: string
  condition: string
  secondary: string
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

  if (!repositoryId) return null

  return (
    <div className='grid grid-cols-10 space-x-3 text-darkGrey'>
      <div className='col-span-3 relative mt-1'>
        <div>
          <div className='w-full rounded-[5px] overflow-hidden border border-mediumGrey bg-hue-light py-2 pl-3 pr-10 text-sm'>
            {primary}
          </div>
        </div>
      </div>
      <div className='col-span-2 relative mt-1'>
        <div>
          <div className='w-full rounded-[5px] overflow-hidden border border-mediumGrey bg-hue-light py-2 pl-3 pr-10 text-sm'>
            {condition}
          </div>
        </div>
      </div>
      <div className='col-span-4 relative mt-1'>
        <div>
          <div className='w-full rounded-[5px] overflow-hidden border border-mediumGrey bg-hue-light py-2 pl-3 pr-10 text-sm'>
            {secondary}
          </div>
        </div>
      </div>
      <div className='col-span-1 relative mt-1 flex items-center right-0 justify-center'>
        <Button disabled={mutation.isLoading} onClick={() => mutation.mutate({ id, repositoryId })}>
          <TrashIcon />
        </Button>
      </div>
    </div>
  )
}

export const TraitRulesDisplayAll = ({
  title,
  traitElements,
}: {
  title: string
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
    <div className='w-full flex flex-col space-y-3'>
      <span className={`block text-xs font-semibold uppercase text-darkGrey`}>{title}</span>
      {traitElements
        .filter(
          ({ rulesPrimary, rulesSecondary }) =>
            (rulesPrimary && rulesPrimary.length) || (rulesSecondary && rulesSecondary.length)
        )
        .map(
          ({
            rulesPrimary,
            rulesSecondary,
          }: TraitElement & {
            rulesPrimary: (Rules & {
              primaryTraitElement: TraitElement
              secondaryTraitElement: TraitElement
            })[]
            rulesSecondary: (Rules & {
              primaryTraitElement: TraitElement
              secondaryTraitElement: TraitElement
            })[]
          }) => {
            return (
              <>
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
                              primary={rule.primaryTraitElement.name}
                              condition={rule.condition}
                              secondary={rule.secondaryTraitElement.name}
                            />
                          )
                        })}
                      {rulesSecondary
                        .filter((rule) => rule.condition === ruleType)
                        .map((rule, index) => {
                          return (
                            <TraitRulesDisplayPerItem
                              id={rule.id}
                              key={index}
                              primary={rule.secondaryTraitElement.name}
                              condition={rule.condition}
                              secondary={rule.primaryTraitElement.name}
                            />
                          )
                        })}
                    </div>
                  )
                })}
              </>
            )
          }
        )}
    </div>
  )
}
