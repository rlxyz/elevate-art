import { Combobox } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import { Dispatch, SetStateAction, useState } from "react";
import { RulesEnum, RulesType } from "src/shared/compiler";

export const RulesSelectConditionCombobox = ({
  selected,
  onChange,
}: {
  selected: "cannot mix with" | "only mixes with" | null;
  onChange: Dispatch<
    SetStateAction<"cannot mix with" | "only mixes with" | null>
  >;
}) => {
  const [query, setQuery] = useState("");
  const filteredConditions: RulesType[] =
    query === ""
      ? [
          RulesEnum.enum["cannot mix with"] as RulesType,
          RulesEnum.enum["only mixes with"] as RulesType,
        ]
      : [
          RulesEnum.enum["cannot mix with"] as RulesType,
          RulesEnum.enum["only mixes with"] as RulesType,
        ].filter((conditions) => {
          return conditions.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox as="div" value={selected} onChange={onChange}>
      <Combobox.Input
        className={clsx(
          "border-mediumGrey bg-hue-light w-full rounded-[5px] border py-2 pl-3 pr-10 text-xs",
          selected && "border-blueHighlight",
        )}
        onChange={(event) => setQuery(event.target.value)}
        displayValue={(value: RulesType) => value}
        placeholder="Select Condition"
      />
      <Combobox.Button className="rounded-r-md absolute inset-y-0 right-0 flex items-center px-2 focus:outline-none">
        <SelectorIcon className="text-darkGrey h-3 w-3" aria-hidden="true" />
      </Combobox.Button>
      <Combobox.Options className="rounded-md bg-white ring-black absolute z-10 mt-1 max-h-60 min-w-full overflow-auto py-1 text-base shadow-lg ring-1 ring-opacity-5 focus:outline-none sm:text-sm">
        {filteredConditions.map((condition: RulesType) => (
          <Combobox.Option
            key={condition}
            value={condition}
            className={({ active }) =>
              clsx(
                "relative cursor-default select-none py-2 pl-3 pr-9",
                active ? "text-blueHighlight" : "text-black",
              )
            }
          >
            {({ active, selected }) => (
              <>
                <span
                  className={clsx(
                    "block truncate",
                    selected ? "font-semibold" : "",
                  )}
                >
                  {condition}
                </span>
                {selected && (
                  <span
                    className={clsx(
                      "absolute inset-y-0 right-0 flex items-center pr-4",
                      active ? "text-black" : "text-indigo-600",
                    )}
                  >
                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                )}
              </>
            )}
          </Combobox.Option>
        ))}
      </Combobox.Options>
    </Combobox>
  );
};
