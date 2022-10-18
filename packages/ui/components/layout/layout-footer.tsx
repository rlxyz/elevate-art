import { FC } from "react";

const LayoutFooter: FC = () => {
  return (
    <footer className="w-full flex items-center justify-between">
      <p className="text-center text-xs text-accents_6">
        &copy; 2022 Elevate Art. All rights reserved.
      </p>
    </footer>
  );
};

LayoutFooter.displayName = "LayoutFooter";
export default LayoutFooter;
