import Button from '@components/UI/Button'
import { TrashIcon } from '@heroicons/react/outline'
import { useNotification } from '@hooks/useNotification'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { LayerElement, Rules, TraitElement } from '@prisma/client'
import { createCloudinary } from '@utils/cloudinary'
import { trpc } from '@utils/trpc'
import clsx from 'clsx'
import Image from 'next/image'
import { clientEnv } from 'src/env/schema.mjs'
import { RulesEnum } from 'src/types/enums'

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

  if (!repositoryId) return null

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
          className='w-full bg-inherit'
          disabled={mutation.isLoading}
          onClick={() => mutation.mutate({ id, repositoryId })}
        >
          <TrashIcon className='w-5 h-5 text-mediumGrey' />
        </Button>
      </div>
    </div>
  )
}

const ComboboxInput = ({
  traitElement,
  layerName,
  highlight = true,
}: {
  highlight?: boolean
  layerName: string
  traitElement: TraitElement | null | undefined
}) => {
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const cld = createCloudinary()
  return (
    <div
      className={clsx(
        'flex items-center space-x-2 w-full rounded-[5px] border border-mediumGrey text-sm bg-hue-light pl-3 pr-10 shadow-sm',
        highlight && traitElement && 'border-blueHighlight'
      )}
    >
      {traitElement ? (
        <>
          <div className='flex flex-row items-center space-x-3 py-2'>
            <div className='relative border border-mediumGrey h-[20px] w-[20px] rounded-[3px]'>
              <Image
                priority
                layout='fill'
                src={cld
                  .image(`${clientEnv.NEXT_PUBLIC_NODE_ENV}/${repositoryId}/${traitElement.layerElementId}/${traitElement.id}`)
                  .toURL()}
                className='rounded-[3px]'
              />
            </div>
            <div className='flex flex-row space-x-2 items-center'>
              <span className={clsx('block truncate text-xs tracking-tight text-darkGrey')}>{layerName}</span>
              <span className={clsx('block truncate text-sm text-black')}>{traitElement.name}</span>
            </div>
          </div>
        </>
      ) : (
        <input className='w-full h-full py-2 focus:outline-none' placeholder='Search a trait...' />
      )}
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
        .filter(
          ({ rulesPrimary, rulesSecondary }) => (rulesPrimary && rulesPrimary.length) || (rulesSecondary && rulesSecondary.length)
        )
        .map(
          ({
            rulesPrimary,
            rulesSecondary,
          }: TraitElement & {
            rulesPrimary: (Rules & {
              primaryTraitElement: TraitElement & {
                layerElement: LayerElement
              }
              secondaryTraitElement: TraitElement & {
                layerElement: LayerElement
              }
            })[]
            rulesSecondary: (Rules & {
              primaryTraitElement: TraitElement & {
                layerElement: LayerElement
              }
              secondaryTraitElement: TraitElement & {
                layerElement: LayerElement
              }
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
                              primary={rule.primaryTraitElement}
                              condition={rule.condition}
                              secondary={rule.secondaryTraitElement}
                            />
                          )
                        })}
                      {/* {rulesSecondary
                        .filter((rule) => rule.condition === ruleType)
                        .map((rule, index) => {
                          return (
                            <TraitRulesDisplayPerItem
                              id={rule.id}
                              key={index}
                              primary={rule.secondaryTraitElement}
                              condition={rule.condition}
                              secondary={rule.primaryTraitElement}
                            />
                          )
                        })} */}
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

export default RuleDisplayAll
