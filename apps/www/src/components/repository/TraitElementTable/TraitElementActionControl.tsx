import { FC, useState } from "react";
import { TraitElementCreateModal } from "./index";

export const TraitElementActionControl: FC<any> = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setIsCreateDialogOpen(true)}
        className="bg-blueHighlight border-blueHighlight text-white flex items-center justify-center space-x-1 rounded-[5px] border px-2 text-xs font-semibold disabled:cursor-not-allowed"
      >
        New
      </button>
      {isCreateDialogOpen && <TraitElementCreateModal visible={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} />}
    </>
  );
};
