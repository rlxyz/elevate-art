import clsx from "clsx";
import React from "react";
import LinkIcon from "./LinkIcon";

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

export type LinkProps = Props & Omit<React.AnchorHTMLAttributes<any>, keyof Props>;

const LinkComponent = React.forwardRef<HTMLAnchorElement, React.PropsWithChildren<LinkProps>>(
  (
    { href, color, underline, children, className, block, icon, ...props }: React.PropsWithChildren<LinkProps> & typeof defaultProps,
    ref: React.Ref<HTMLAnchorElement>,
  ) => {
    return (
      <a
        className={clsx(
          "inline-flex items-baseline no-underline",
          "text-inherit h-auto w-full",
          underline && "hover:text-blueHighlight hover:underline",
          color && "text-blueHighlight",
          block && "rounded-[5px] px-3 py-2 hover:bg-accents_8",
          block && color && "hover:bg-lightGray",
          className,
        )}
        href={href}
        {...props}
        ref={ref}
      >
        {children}
        {icon && <LinkIcon />}
      </a>
    );
  },
);

LinkComponent.defaultProps = defaultProps;
LinkComponent.displayName = "Link";
export default LinkComponent;
