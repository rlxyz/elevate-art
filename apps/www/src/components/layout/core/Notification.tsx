import clsx from "clsx";
import * as React from "react";

interface Props {
  children: React.ReactNode;
  id: string;
  type: "success" | "error" | "info";
}

export const Notification = ({ children, id, type }: Props) => {
  return (
    <div
      id={id}
      className={clsx(
        type === "error" && "bg-redError",
        type === "success" && "bg-blueHighlight",
        type === "info" && "bg-black",
        "relative z-[1000] w-[350px] max-w-lg rounded-[5px] p-4 shadow-lg",
      )}
      role="alert"
    >
      <div className="flex w-full items-center text-xs text-accents_8">
        {children}
      </div>
    </div>
  );
};
