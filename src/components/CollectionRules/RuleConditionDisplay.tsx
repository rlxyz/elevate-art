import { Button } from '@components/UI/Button'
import { Combobox } from '@headlessui/react'
import { TrashIcon } from '@heroicons/react/outline'
import { SelectorIcon } from '@heroicons/react/solid'
import { useCurrentLayer } from '@hooks/useCurrentLayer'
import useRepositoryRouterStore from '@hooks/useRepositoryRouterStore'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { TraitElement, Rules } from '@prisma/client'
import { trpc } from '@utils/trpc'
import { useEffect, useState } from 'react'

export const RuleConditionDisplay = ({
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
  const mutation = trpc.useMutation('trait.deleteRuleById', {
    onSuccess: (data, variables) => {
      onSuccess()
    },
  })
  const [selectedLayerTrait, setSelectedLayerTrait] = useState()
  return (
    <div className='w-full flex flex-col space-y-3'>
      <span className={`block text-xs font-semibold uppercase text-darkGrey`}>{title}</span>
      {traitElements
        .filter(
          ({ rulesPrimary, rulesSecondary }) =>
            (rulesPrimary && rulesPrimary.length) || (rulesSecondary && rulesSecondary.length)
        )
        .map(
          (
            {
              id,
              name,
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
            },
            index
          ) => {
            return (
              <div className='grid grid-cols-10 space-x-3' key={index}>
                <div className='col-span-3 relative mt-1'>
                  <Combobox
                    disabled
                    as='div'
                    value={selectedLayerTrait}
                    onChange={setSelectedLayerTrait}
                  >
                    <div className='w-full rounded-[5px] border border-lightGray bg-hue-light py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm'>
                      {name}
                    </div>
                  </Combobox>
                </div>
                <div className='col-span-2 relative mt-1'>
                  <Combobox
                    disabled
                    as='div'
                    value={selectedLayerTrait}
                    onChange={setSelectedLayerTrait}
                  >
                    <div className='w-full rounded-[5px] border border-lightGray bg-hue-light py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm'>
                      {rulesPrimary[0]?.condition}
                    </div>
                  </Combobox>
                </div>
                <div className='col-span-4 relative mt-1'>
                  <Combobox
                    disabled
                    as='div'
                    value={selectedLayerTrait}
                    onChange={setSelectedLayerTrait}
                  >
                    <div className='w-full rounded-[5px] border border-lightGray bg-hue-light py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm'>
                      {rulesPrimary
                        .map(
                          (
                            rule: Rules & {
                              primaryTraitElement: TraitElement
                              secondaryTraitElement: TraitElement
                            }
                          ) => rule.secondaryTraitElement.name
                        )
                        .join(', ')}
                    </div>
                  </Combobox>
                </div>
                <div className='col-span-1 relative mt-1 flex items-center right-0 justify-center'>
                  <Button
                    disabled={mutation.isLoading}
                    onClick={() => mutation.mutate({ id })}
                    className='h-5 w-5 text-lightGray'
                  >
                    <TrashIcon />
                  </Button>
                </div>
              </div>
            )
          }
        )}
    </div>
  )
}
