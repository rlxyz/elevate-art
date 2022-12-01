import { Table as ReactTable } from "@tanstack/react-table";
import Big from "big.js";
import clsx from "clsx";
import { FC } from "react";
import { truncate } from "src/client/utils/format";
import { timeAgo } from "src/client/utils/time";
import { TraitElementFields } from "./useTraitElementForm";

interface Props {
  table: ReactTable<TraitElementFields>;
  id: string;
}

export type TraitElementGridProps = Props &
  Omit<React.HTMLAttributes<any>, keyof Props>;

/**
 * This Functional Component maintains all the logic related to the TraitElementGrid.
 * It displays the TraitElement images and trait rarity in a grid.
 */
const TraitElementGrid: FC<TraitElementGridProps> = ({
  table,
  id,
  className,
}) => {
  return (
    <div className={clsx(className, "grid grid-cols-5 gap-3")}>
      {table
        .getRowModel()
        .rows.sort((a, b) => (a.original.id === `none-${id}` ? -1 : 1))
        .map(({ original }, index) => {
          return (
            <div
              key={original.id}
              className="border-mediumGrey h-auto w-auto flex-col rounded-[5px] border"
            >
              <div className="border-mediumGrey flex h-[10rem] w-auto items-center overflow-hidden border-b lg:h-[12.5rem] xl:h-[15rem] 2xl:h-[20rem]">
                {!original.readonly && (
                  <img
                    loading="lazy"
                    className="border-mediumGrey h-auto w-auto border-t border-b"
                    src={original.imageUrl}
                  />
                )}
              </div>
              <div className="flex flex-col space-y-1 px-1 py-2">
                <span className="w-full overflow-hidden text-xs font-semibold">
                  {truncate(original.name)}
                </span>
                <div className="flex flex-col text-[0.6rem]">
                  <span className="w-full overflow-hidden font-semibold">
                    {Big(original.weight).toFixed(4)}%
                  </span>
                  <span className="text-darkGrey w-full overflow-hidden">
                    Update {timeAgo(original.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default TraitElementGrid;
