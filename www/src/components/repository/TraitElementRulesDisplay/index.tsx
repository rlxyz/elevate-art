import { TraitElementWithRules } from '@hooks/query/useQueryRepositoryLayer'
import { RulesEnum, RulesType } from '@utils/compiler'
import { TraitElementRulesDisplayOne } from './TraitElementRulesDisplayOne'

export const TraitElementDisplayRules = ({ traitElements }: { traitElements: TraitElementWithRules[] }) => {
  return (
    <div className='w-full flex flex-col space-y-2'>
      {traitElements
        .filter(({ rulesPrimary }) => rulesPrimary && rulesPrimary.length)
        .map(({ rulesPrimary }, index) => {
          return (
            <div key={index}>
              {[RulesEnum.enum['cannot mix with'], RulesEnum.enum['only mixes with']].map((ruleType: string, index) => {
                return (
                  <div className='space-y-2' key={index}>
                    {rulesPrimary
                      .filter((rule) => rule.condition === ruleType)
                      .map((rule, index) => {
                        return (
                          <TraitElementRulesDisplayOne
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
        })}
    </div>
  )
}
