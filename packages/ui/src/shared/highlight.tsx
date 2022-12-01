import React, { useMemo, useRef } from "react";
import { isUnplacedRect, ReactiveDomReact } from "../utils/useLayout";
import usePrevious from "../utils/usePrevious";

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

export type HighlightProps = Props & Omit<React.HTMLAttributes<any>, keyof Props>;

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
      width: `${width}px`,
      left: `${rect.left + (rect.width - width) / 2}px`,
      height: `${height}px`,
      top: `${rect.elementTop + (rect.height - height) / 2}px`,
      transition: isFirstVisible ? "opacity" : "opacity, width, left, top",
    };
  }, [rect, hoverWidthRatio, hoverHeightRatio]);

  return (
    <div
      ref={ref}
      style={{
        width: position.width,
        left: position.left,
        height: position.height,
        top: position.top,
        opacity: visible ? activeOpacity : 0,
        transition: "0.15s ease",
        transitionProperty: position.transition,
      }}
      className="absolute rounded-primary bg-accents_7"
      {...props}
    />
  );
};

export default Highlight;
