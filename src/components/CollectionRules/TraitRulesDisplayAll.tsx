import { Button } from '@components/UI/Button'
import { TrashIcon } from '@heroicons/react/outline'
import { useNotification } from '@hooks/useNotification'
import { TraitElement, Rules } from '@prisma/client'
import { trpc } from '@utils/trpc'
import { RulesEnum } from 'src/types/enums'

export const TraitRulesDisplayPerItem = ({
  id,
  primary,
  condition,
  secondary,
  onSuccess,
}: {
  id: string
  primary: string
  condition: string
  secondary: string
  onSuccess: () => void
}) => {
  const { notifySuccess, notifyError } = useNotification()
  const mutation = trpc.useMutation('trait.deleteRuleById', {
    onSuccess: (data) => {
      onSuccess()
      notifySuccess(
        <div>
          <span className='text-blueHighlight text-semibold'>{data?.primaryTraitElement.name}</span>
          <span>{` now `}</span>
          <span className='text-redError'>{`doesnt `}</span>
          <span>{`${data?.condition} `}</span>
          <span className='font-semibold'>{data?.secondaryTraitElement.name}</span>
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
      <div className='col-span-3 relative mt-1'>
        <div>
          <div className='w-full rounded-[5px] border border-mediumGrey bg-hue-light py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm'>
            {primary}
          </div>
        </div>
      </div>
      <div className='col-span-2 relative mt-1'>
        <div>
          <div className='w-full rounded-[5px] border border-mediumGrey bg-hue-light py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm'>
            {condition}
          </div>
        </div>
      </div>
      <div className='col-span-4 relative mt-1'>
        <div>
          <div className='w-full rounded-[5px] border border-mediumGrey bg-hue-light py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm'>
            {secondary}
          </div>
        </div>
      </div>
      <div className='col-span-1 relative mt-1 flex items-center right-0 justify-center'>
        <Button
          disabled={mutation.isLoading}
          onClick={() => mutation.mutate({ id })}
          className='h-5 w-5 text-mediumGrey'
        >
          <TrashIcon />
        </Button>
      </div>
    </div>
  )
}

export const TraitRulesDisplayAll = ({
  title,
  traitElements,
  onSuccess,
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
  onSuccess: () => void
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
                {[RulesEnum.enum['cannot mix with']].map((ruleType: string) => {
                  return (
                    <>
                      {rulesPrimary
                        .filter((rule) => rule.condition === ruleType)
                        .map((rule, index) => {
                          return (
                            <TraitRulesDisplayPerItem
                              onSuccess={() => onSuccess()}
                              id={rule.primaryTraitElementId}
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
                              onSuccess={() => onSuccess()}
                              id={rule.primaryTraitElementId}
                              key={index}
                              primary={rule.secondaryTraitElement.name}
                              condition={rule.condition}
                              secondary={rule.primaryTraitElement.name}
                            />
                          )
                        })}
                    </>
                  )
                })}
              </>
            )
          }
        )}
    </div>
  )
}
