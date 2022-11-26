import { TraitElementWithRules } from '@hooks/query/useQueryRepositoryLayer'
import { RulesEnum } from '@utils/compiler'
import { FC } from 'react'
import { RulesDisplayOneItem } from './RulesDisplayOneItem'

interface TraitElementDisplayRulesProps {
  traitElements: TraitElementWithRules[]
}

export const TraitElementDisplayRules: FC<TraitElementDisplayRulesProps> = ({ traitElements }) => {
  return (
    <div className='w-full flex flex-col space-y-2'>
      {traitElements
        .filter(({ rulesPrimary }) => rulesPrimary && rulesPrimary.length)
        .map(({ id, rulesPrimary }, index) => {
          return (
            <div key={`${id}-${index}`}>
              {[RulesEnum.enum['cannot mix with'], RulesEnum.enum['only mixes with']].map((condition, index) => {
                return (
                  <div className='space-y-2' key={index}>
                    {rulesPrimary
                      .filter((rule) => rule.condition === condition)
                      .map((rule) => {
                        return (
                          <RulesDisplayOneItem
                            id={rule.id}
                            key={rule.id}
                            traitElements={[rule.primaryTraitElement, rule.secondaryTraitElement]}
                            condition={rule.condition}
                          />
                        )
                      })}
                  </div>
                )
              })}
            </div>
          )
        })}
    </div>
  )
}
