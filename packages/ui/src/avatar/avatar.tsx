import clsx from "clsx";
import React from "react";

interface Props {
  src?: string;
  stacked?: boolean;
  text?: string;
  isSquare?: boolean;
  className?: string;
}

const defaultProps: Props = {
  stacked: false,
  text: "",
  isSquare: false,
  className: "",
};

type NativeAttrs = Omit<
  Partial<React.ImgHTMLAttributes<any> & React.HTMLAttributes<any>>,
  keyof Props
>;
export type AvatarProps = Props & NativeAttrs;

const safeText = (text: string): string => {
  if (text.length <= 4) return text;
  return text.slice(0, 3);
};

const AvatarComponent: React.FC<AvatarProps> = ({
  src,
  stacked,
  text,
  isSquare,
  className,
  ...props
}: AvatarProps & typeof defaultProps) => {
  const showText = !src;
  return (
    <span
      className={clsx(
        className,
        "inline-block relative overflow-hidden border border-border align-top bg-background box-border h-7 w-7 p-0",
        stacked && "ml-2.5",
        isSquare ? "rounded-primary" : "rounded-full"
      )}
    >
      {!showText && (
        <img
          alt="avatar"
          className={clsx(
            "inline-block object-cover w-full h-100 select-none",
            isSquare ? "rounded-primary" : "rounded-full"
          )}
          src={src}
          draggable={false}
          {...props}
        />
      )}
      {showText && text && (
        <span
          className={clsx(
            "absolute left-1/2 top-1/2 text-xs items-center -translate-x-1/2 -translate-y-1/2 whitespace-nowrap select-none"
          )}
          {...props}
        >
          {safeText(text)}
        </span>
      )}
    </span>
  );
};

AvatarComponent.defaultProps = defaultProps;
AvatarComponent.displayName = "Avatar";
export default AvatarComponent;
