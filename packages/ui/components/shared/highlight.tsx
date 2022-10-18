import clsx from "clsx";
import { isUnplacedRect, ReactiveDomReact } from "components/utils/useLayout";
import usePrevious from "components/utils/usePrevious";
import React, { useMemo, useRef } from "react";

interface Props {
  rect: ReactiveDomReact;
  visible?: boolean;
  hoverHeightRatio?: number;
  hoverWidthRatio?: number;
  activeOpacity?: number;
}

type HighlightPosition = {
  width: string;
  left: string;
  height: string;
  top: string;
  transition: string;
};

export type HighlightProps = Props &
  Omit<React.HTMLAttributes<any>, keyof Props>;

const Highlight: React.FC<HighlightProps> = ({
  rect,
  visible,
  hoverHeightRatio = 1,
  hoverWidthRatio = 1,
  activeOpacity = 0.8,
  className,
  ...props
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isFirstVisible = usePrevious<boolean>(isUnplacedRect(rect));
  const position = useMemo<HighlightPosition>(() => {
    const width = rect.width * hoverWidthRatio;
    const height = rect.height * hoverHeightRatio;
    return {
      width: `w-[${width}px]`,
      left: `left-[${rect.left + (rect.width - width) / 2}px]`,
      height: `h-[${height}px]`,
      top: `top-[${rect.elementTop + (rect.height - height) / 2}px]`,
      transition: isFirstVisible ? "opacity" : "opacity, width, left, top",
    };
  }, [rect, hoverWidthRatio, hoverHeightRatio]);

  return (
    <div
      ref={ref}
      className={clsx(
        `absolute rounded-[5px] bg-accents_2`,
        position.width,
        position.left,
        position.height,
        position.top,
        visible ? `opacity-[${activeOpacity}]` : `opacity-[0]`,
        "transition-opacity"
      )}
      {...props}
    />
  );
};

export default Highlight;
