import clsx from "clsx";
import React from "react";

const ModalItemComponent: React.FC<React.PropsWithChildren<React.AnchorHTMLAttributes<any>>> = ({ children, className, ...props }) => {
  return (
    <div {...props} className={clsx(className, "flex w-full flex-col items-start p-2")}>
      {children}
    </div>
  );
};

ModalItemComponent.displayName = "ModalItem";
export default ModalItemComponent;
