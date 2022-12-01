import clsx from "clsx";
import * as NextLink from "next/link";

export const Link = ({
  children,
  title,
  href,
  disabled,
  className,
  enabled = false,
  external = false,
  hover = false,
  rounded = true,
}: {
  href: string;
  enabled?: boolean;
  external?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  title?: string;
  hover?: boolean;
  rounded?: boolean;
}) => {
  return disabled ? (
    <div className={"py-2"}>
      {title && (
        <div className="text-black flex w-full flex-row items-center justify-between px-5 text-xs">
          <span>{title}</span>
        </div>
      )}
      {children}
    </div>
  ) : (
    <NextLink.default href={href} legacyBehavior>
      {external ? (
        <a className={clsx(className)}>{children}</a>
      ) : (
        <a>
          <div
            className={clsx(
              `hover:bg-lightGray flex cursor-pointer flex-row justify-between py-2`,
              enabled ? "font-semibold" : "",
              enabled && hover ? "bg-lightGray" : "",
              rounded ? "rounded-[5px]" : "",
              className,
            )}
          >
            {title && (
              <div className="text-black flex w-full flex-row items-center justify-between px-5 text-xs">
                <span>{title}</span>
              </div>
            )}
            {children}
          </div>
        </a>
      )}
    </NextLink.default>
  );
};
