import clsx from "clsx";
import React from "react";
import LinkIcon from "./icon";

export interface Props {
  href?: string;
  color?: boolean;
  icon?: boolean;
  underline?: boolean;
  block?: boolean;
  className?: string;
}

const defaultProps: Props = {
  href: "",
  color: false,
  icon: false,
  underline: false,
  block: false,
  className: "",
};

export type LinkProps = Props &
  Omit<React.AnchorHTMLAttributes<any>, keyof Props>;

const LinkComponent = React.forwardRef<
  HTMLAnchorElement,
  React.PropsWithChildren<LinkProps>
>(
  (
    {
      href,
      color,
      underline,
      children,
      className,
      block,
      icon,
      ...props
    }: React.PropsWithChildren<LinkProps> & typeof defaultProps,
    ref: React.Ref<HTMLAnchorElement>
  ) => {
    return (
      <a
        className={clsx(
          className,
          "inline-flex items-baseline no-underline",
          "text-inherit w-fit h-auto",
          underline && "hover:underline hover:bg-accents_5",
          color && "text-success",
          block && "rounded-[5px] hover:bg-accents_7 p-1",
          block && color && "hover:bg-linkLighter"
        )}
        href={href}
        {...props}
        ref={ref}
      >
        {children}
        {icon && <LinkIcon />}
      </a>
    );
  }
);

LinkComponent.defaultProps = defaultProps;
LinkComponent.displayName = "Link";
export default LinkComponent;
