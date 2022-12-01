import clsx from "clsx";
import Image from "next/image";
import { useQueryCollectionFindAll } from "src/hooks/trpc/collection/useQueryCollectionFindAll";

import { useState } from "react";
import CollectionIncrementGenerationDialog from "./CollectionIncrementGenerationDialog";

export const GenerateButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { current: collection } = useQueryCollectionFindAll();
  return (
    <div
      className={clsx(
        !collection ? "h-full animate-pulse rounded-[5px] bg-accents_7 bg-opacity-50" : "border border-border",
        "flex h-full w-full items-center justify-center rounded-[5px]",
      )}
    >
      <div className={clsx(!collection && "invisible")}>
        <button disabled={!collection} onClick={() => setIsOpen(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-4 w-4 text-accents_5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </button>
      </div>
      <CollectionIncrementGenerationDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

const Index = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="flex items-center rounded-[5px] border border-border px-4 py-3">
        <div className="space-y-4">
          <span className="flex flex-col space-y-3 text-xs font-normal">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Generate</span>
            </div>
            <span className="text-accents_5">You can regenerate your collection by clicking this button.</span>
            <button onClick={() => setIsOpen(true)}>
              <span className="flex items-center justify-center space-x-2">
                <Image priority width={30} height={30} src="/images/logo-white.png" alt="Logo" />
                <span className="text-xs">elevate.art</span>
              </span>
            </button>
          </span>
        </div>
        <CollectionIncrementGenerationDialog isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </>
  );
};

export default Index;
