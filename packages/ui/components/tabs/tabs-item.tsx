import clsx from "clsx";
import React, { useEffect, useMemo, useRef } from "react";
import { TabsInternalCellProps, useTabsContext } from "./tabs-context";

interface Props {
  label: string | React.ReactNode;
  value: string;
  disabled?: boolean;
}

const defaultProps: Props = {
  disabled: false,
  label: "",
  value: "",
};

export type TabsItemProps = Props &
  Omit<React.HTMLAttributes<any>, keyof Props>;

const TabsItemComponent: React.FC<React.PropsWithChildren<TabsItemProps>> = ({
  children,
  value,
  label,
  disabled,
}: React.PropsWithChildren<TabsItemProps> & typeof defaultProps) => {
  const { register, currentValue } = useTabsContext();
  const isActive = useMemo(() => currentValue === value, [currentValue, value]);

  const TabsInternalCell: React.FC<TabsInternalCellProps> = ({
    onClick,
    onMouseOver,
    // @todo activeClassName - not being used. not sure what it does? sr: https://github.com/geist-org/geist-ui/blob/0381813bdbd7eae802d4792ae88c8336f3afacb9/components/tabs/tabs-item.tsx#L44
    activeClassName,
    activeStyle,
    hideBorder,
  }) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const { currentValue } = useTabsContext();
    const active = currentValue === value;

    return (
      <div
        ref={ref}
        className={clsx(
          "relative flex items-center box-border cursor-pointer bg-transparent",
          "w-auto h-auto py-3 px-2 mx-1 first-of-type:ml-0 z-1",
          "outline-none capitalize whitespace-nowrap select-none text-xs leading-normal",
          "after:absolute after:content-[''] after:-bottom-[1px] after:left-0 after:right-0 after:w-full after:h-[2px] after:rounded-secondary after:scale-x-75 after:bg-foreground after:text-foreground after:transition-opacity after:opacity-0",
          "hover:text-foreground",
          active && "after:opacity-100 after:scale-x-100",
          !active ? "text-accents_5" : "text-foreground",
          disabled && "cursor-not-allowed text-accents_3",
          hideBorder &&
            "before:block before:font-semibold before:height-0 before:overflow-hidden before:invisible after:hidden",
          hideBorder && active && "text-semibold"
        )}
        role="button"
        key={value}
        onMouseOver={onMouseOver}
        onClick={() => {
          if (disabled) return;
          onClick && onClick(value);
        }}
        style={active ? activeStyle : {}}
        // data-geist="tab-item" // @todo fix this? src: https://github.com/geist-org/geist-ui/blob/0381813bdbd7eae802d4792ae88c8336f3afacb9/components/tabs/tabs-item.tsx#L61
      >
        {label}
        {/* <style jsx>{`
          .tab {
            --tabs-item-hover-left: calc(-1 * ${SCALES.pl(0.28)});
            --tabs-item-hover-right: calc(-1 * ${SCALES.pr(0.28)});
          }
          .tab :global(svg) {
            max-height: 1em;
            margin-right: 5px;
          }
          .hide-border:before {
            content: ${label};
          }
        `}</style> */}
      </div>
    );
  };
  TabsInternalCell.displayName = "TabsInternalCell";

  useEffect(() => {
    register && register({ value, cell: TabsInternalCell });
  }, [value, label, disabled]);

  /* eslint-disable react/jsx-no-useless-fragment */
  return isActive ? <>{children}</> : null;
};

TabsItemComponent.defaultProps = defaultProps;
TabsItemComponent.displayName = "TabsItem";
export default TabsItemComponent;
