import clsx from "clsx";
import React, { ReactNode } from "react";
import BreadcrumbsSeparator from "./breadcrumbs-separator";
// import useScale, { withScale } from "../use-scale";
// import useTheme from "../use-theme";
// import { addColorAlpha } from "../utils/color";

interface Props {
  separator?: string | ReactNode;
  className?: string;
}

const defaultProps: Props = {
  separator: "/",
  className: "",
};

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>;
export type BreadcrumbsProps = Props & NativeAttrs;

const BreadcrumbsComponent: React.FC<
  React.PropsWithChildren<BreadcrumbsProps>
> = ({
  separator,
  children,
  className,
}: BreadcrumbsProps & typeof defaultProps) => {
  //   const theme = useTheme();
  //   const { SCALES } = useScale();
  //   const hoverColor = useMemo(() => {
  //     return addColorAlpha(theme.palette.link, 0.85);
  //   }, [theme.palette.link]);

  const childrenArray = React.Children.toArray(children);
  const withSeparatorChildren = childrenArray.map((item, index) => {
    if (!React.isValidElement(item)) return item;
    const last = childrenArray[index - 1];
    const lastIsSeparator =
      React.isValidElement(last) && last.type === BreadcrumbsSeparator;
    const currentIsSeparator = item.type === BreadcrumbsSeparator;
    if (!lastIsSeparator && !currentIsSeparator && index > 0) {
      return (
        <React.Fragment key={index}>
          <BreadcrumbsSeparator>{separator}</BreadcrumbsSeparator>
          <span
            className={clsx(index == childrenArray.length - 1 && "text-black")}
          >
            {item}
          </span>
        </React.Fragment>
      );
    }
    return item;
  });

  return (
    <nav
      className={clsx(
        className,
        "flex items-center text-xs w-auto h-auto text-darkGrey box-border"
      )}
    >
      {withSeparatorChildren}
    </nav>
  );
};

BreadcrumbsComponent.defaultProps = defaultProps;
BreadcrumbsComponent.displayName = "Breadcrumbs";
// const Breadcrumbs = withScale(BreadcrumbsComponent);
export default BreadcrumbsComponent;
