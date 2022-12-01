import { FC } from "react";
import { TraitElement } from "src/hooks/trpc/layerElement/useQueryLayerElementFindAll";
import { RulesEnum } from "src/shared/compiler";
import { RulesDisplayOneItem } from "./RulesDisplayOneItem";

interface RulesDisplayProps {
  traitElements: TraitElement[];
}

export const RulesDisplay: FC<RulesDisplayProps> = ({ traitElements }) => {
  return (
    <div className="flex w-full flex-col space-y-2">
      {traitElements
        .filter(({ rulesPrimary }) => rulesPrimary && rulesPrimary.length)
        .map(({ id, rulesPrimary }, index) => {
          return (
            <div key={`${id}-${index}`}>
              {[
                RulesEnum.enum["cannot mix with"],
                RulesEnum.enum["only mixes with"],
              ].map((condition, index) => {
                return (
                  <div className="space-y-2" key={index}>
                    {rulesPrimary
                      .filter((rule) => rule.condition === condition)
                      .map((rule) => (
                        <RulesDisplayOneItem rule={rule} key={rule.id} />
                      ))}
                  </div>
                );
              })}
            </div>
          );
        })}
    </div>
  );
};
