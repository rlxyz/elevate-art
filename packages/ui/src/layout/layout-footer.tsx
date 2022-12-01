import { FC } from "react";

const LayoutFooter: FC = () => {
  return (
    <footer className="flex w-full items-center justify-between">
      <p className="text-center text-xs text-accents_5">
        &copy; 2022 Elevate Art. All rights reserved.
      </p>
    </footer>
  );
};

LayoutFooter.displayName = "LayoutFooter";
export default LayoutFooter;
