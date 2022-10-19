import clsx from "clsx";
import Highlight from "components/shared/highlight";
import { useRect } from "components/utils/useLayout";
import React, {
  CSSProperties,
  MouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
// import Highlight from "../shared/highlight";
// import useClasses from "../use-classes";
// import useScale, { withScale } from "../use-scale";
// import useTheme from "../use-theme";
// import { useRect } from "../utils/layouts";
import { TabsConfig, TabsContext, TabsHeaderItem } from "./tabs-context";

interface Props {
  initialValue?: string;
  value?: string;
  hideDivider?: boolean;
  hideBorder?: boolean;
  highlight?: boolean;
  onChange?: (val: string) => void;
  className?: string;
  leftSpace?: CSSProperties["marginLeft"];
  hoverHeightRatio?: number;
  hoverWidthRatio?: number;
  align?: CSSProperties["justifyContent"];
  activeClassName?: string;
  activeStyle?: CSSProperties;
}

const defaultProps: Props = {
  className: "",
  hideDivider: false,
  highlight: true,
  leftSpace: "12px" as CSSProperties["marginLeft"],
  hoverHeightRatio: 0.7,
  hoverWidthRatio: 1.15,
  activeClassName: "",
  activeStyle: {},
  align: "left",
};

export type TabsProps = Props & Omit<React.HTMLAttributes<any>, keyof Props>;

const TabsComponent: React.FC<React.PropsWithChildren<TabsProps>> = ({
  initialValue: userCustomInitialValue,
  value,
  hideDivider,
  hideBorder,
  children,
  onChange,
  className,
  leftSpace,
  highlight,
  hoverHeightRatio,
  hoverWidthRatio,
  activeClassName,
  activeStyle,
  align,
  ...props
}: React.PropsWithChildren<TabsProps> & typeof defaultProps) => {
  // const theme = useTheme();
  // const { SCALES } = useScale();
  const [tabs, setTabs] = useState<Array<TabsHeaderItem>>([]);
  const [selfValue, setSelfValue] = useState<string | undefined>(
    userCustomInitialValue
  );
  const ref = useRef<HTMLDivElement | null>(null);
  const [displayHighlight, setDisplayHighlight] = useState<boolean>(false);
  const { rect, setRect } = useRect();

  const register = (next: TabsHeaderItem) => {
    setTabs((last) => {
      const hasItem = last.find((item) => item.value === next.value);
      if (!hasItem) return [...last, next];
      return last.map((item) => {
        if (item.value !== next.value) return item;
        return {
          ...item,
          ...next,
        };
      });
    });
  };

  const initialValue = useMemo<TabsConfig>(
    () => ({
      register,
      currentValue: selfValue,
      inGroup: true,
      leftSpace,
    }),
    [selfValue, leftSpace]
  );

  useEffect(() => {
    if (typeof value === "undefined") return;
    setSelfValue(value);
  }, [value]);

  const clickHandler = (value: string) => {
    setSelfValue(value);
    onChange && onChange(value);
  };
  const tabItemMouseOverHandler = (event: MouseEvent<HTMLDivElement>) => {
    setRect(event, () => ref.current);
    if (highlight) {
      setDisplayHighlight(true);
    }
  };

  return (
    <TabsContext.Provider value={initialValue}>
      <div
        className={clsx(className, "text-xs w-initial h-auto p-0 m-0")}
        {...props}
      >
        <header
          className="relative flex flex-nowrap items-center overflow-y-hidden overflow-x-scroll no-scrollbar"
          ref={ref}
          onMouseLeave={() => setDisplayHighlight(false)}
        >
          <Highlight
            rect={rect}
            visible={displayHighlight}
            hoverHeightRatio={hoverHeightRatio}
            hoverWidthRatio={hoverWidthRatio}
          />
          <div
            className={clsx(
              "w-full h-full flex flex-1 flex-nowrap items-center",
              hideDivider ? "border-transparent" : "border-b border-border"
            )}
            style={{ justifyContent: align, paddingLeft: leftSpace }}
          >
            {tabs.map(({ cell: Cell, value }) => (
              <Cell
                key={value}
                onClick={clickHandler}
                onMouseOver={tabItemMouseOverHandler}
                activeClassName={activeClassName}
                activeStyle={activeStyle}
                hideBorder={hideBorder}
              />
            ))}
          </div>
        </header>
        <div className="pt-2">{children}</div>
      </div>
    </TabsContext.Provider>
  );
};

TabsComponent.defaultProps = defaultProps;
TabsComponent.displayName = "Tabs";
export default TabsComponent;
