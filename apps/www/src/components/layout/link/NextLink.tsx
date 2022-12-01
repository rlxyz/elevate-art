import { default as NextLink } from "next/link";
import React from "react";
import Link, { LinkProps } from "./Link";

const defaultProps: LinkProps = {
  href: "/",
  color: false,
  icon: false,
  underline: false,
  block: false,
  className: "",
};

export type NextLinkProps = LinkProps & Omit<React.AnchorHTMLAttributes<any>, keyof LinkProps>;

const NextLinkComponent = React.forwardRef<HTMLAnchorElement, React.PropsWithChildren<LinkProps>>(
  (
    { href, color, underline, children, className, block, icon, ...props }: React.PropsWithChildren<LinkProps> & typeof defaultProps,
    ref: React.Ref<HTMLAnchorElement>,
  ) => {
    return (
      <NextLink href={href || "/404"} legacyBehavior>
        <Link href={href} className={className} ref={ref} color={color} underline={underline} block={block} icon={icon} {...props}>
          {children}
        </Link>
      </NextLink>
    );
  },
);

NextLinkComponent.defaultProps = defaultProps;
NextLinkComponent.displayName = "Link";
export default NextLinkComponent;
