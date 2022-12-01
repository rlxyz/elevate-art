import clsx from "clsx";
import React, { useMemo } from "react";
import Link from "../link";
import { Props as LinkBasicProps } from "../link/link";
import { pickChild } from "../utils/collections";
import BreadcrumbsSeparator from "./breadcrumbs-separator";

interface Props {
  href?: string;
  nextLink?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  className?: string;
}

const defaultProps: Props = {
  nextLink: false,
  className: "",
};

export type BreadcrumbsItemProps = Props & Omit<Omit<React.AnchorHTMLAttributes<any>, keyof Props>, keyof LinkBasicProps>;

const BreadcrumbsItemComponent = React.forwardRef<HTMLAnchorElement, React.PropsWithChildren<BreadcrumbsItemProps>>(
  (
    { href, nextLink, onClick, children, className, ...props }: BreadcrumbsItemProps & typeof defaultProps,
    ref: React.Ref<HTMLAnchorElement>,
  ) => {
    const isLink = useMemo(() => href !== undefined || nextLink, [href, nextLink]);
    const [withoutSepChildren] = pickChild(children, BreadcrumbsSeparator);
    const classes = clsx(className, "inline-flex items-center");

    const clickHandler = (event: React.MouseEvent) => {
      onClick && onClick(event);
    };

    if (!isLink) {
      return (
        <span className={clsx(classes)} onClick={clickHandler}>
          {withoutSepChildren}
        </span>
      );
    }

    return (
      <Link className={clsx(classes, "hover:text-blueHighlight")} href={href} onClick={clickHandler} ref={ref} {...props}>
        {withoutSepChildren}
      </Link>
    );
  },
);

BreadcrumbsItemComponent.defaultProps = defaultProps;
BreadcrumbsItemComponent.displayName = "BreadcrumbsItem";
export default BreadcrumbsItemComponent;
