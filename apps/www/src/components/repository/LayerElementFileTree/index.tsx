import { Repository } from "@elevateart/db";
import { PlusIcon, SwitchVerticalIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import router from "next/router";
import { FC, useState } from "react";
import Menu from "src/components/layout/menu";
import { LayerElement } from "src/hooks/trpc/layerElement/useQueryLayerElementFindAll";
import { timeAgo } from "src/utils/time";
import LayerElementCreateModal from "./LayerElementCreateModal";
import LayerElementFileSelector from "./LayerElementFileSelector";
import LayerElementReorderModal from "./LayerElementReorderItem";

interface Props {
  repository: Repository | undefined;
  layerElements: LayerElement[];
}

export type LayerElementFileTreeProps = Props & Omit<React.HTMLAttributes<any>, keyof Props>;

/**
 * The core LayerElement File Tree. It handles selection of the current layer route & reordering of layers.
 */
const LayerElementFileTree: FC<LayerElementFileTreeProps> = ({ repository, layerElements, className, ...props }) => {
  const sorted = layerElements.sort((a, b) => a.priority - b.priority);
  const [openReordering, setOpenReordering] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const layerName: string = router.query.layer as string;

  /** Handles the last updated LayerElement */
  const layerElementLastEdited = () => {
    return sorted.sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime())[0]?.updatedAt || new Date();
  };

  /** Handles the first LayerElement that was created. Basically, the inception of the repository. */
  const layerElementCreatedAt = () => {
    return repository?.createdAt || new Date();
  };

  return (
    <div {...props} className={clsx(className)}>
      <div className={"border-mediumGrey divide-mediumGrey divide-y rounded-[5px] border"}>
        <div className="relative flex items-center justify-end py-4 px-2">
          <Menu>
            <Menu.Items>
              <Menu.Item as="button" type="button" onClick={() => setIsCreateDialogOpen(true)}>
                <PlusIcon className="h-3 w-3" />
                <span className="text-xs">New</span>
              </Menu.Item>
              <Menu.Item as="button" type="button" onClick={() => setOpenReordering(true)}>
                <SwitchVerticalIcon className="h-3 w-3" />
                <span className="text-xs">Reorder Items</span>
              </Menu.Item>
            </Menu.Items>
            <Menu.Items>
              <div className="text-darkGrey space-x-1 overflow-hidden text-ellipsis whitespace-nowrap text-[0.6rem]">
                <span>Last Edited</span>
                <span>{timeAgo(layerElementLastEdited())}</span>
              </div>
              <div className="text-darkGrey space-x-1 overflow-hidden text-ellipsis whitespace-nowrap text-[0.6rem]">
                <span>Created</span>
                <span>{timeAgo(layerElementCreatedAt())}</span>
              </div>
            </Menu.Items>
          </Menu>
        </div>

        <LayerElementFileSelector items={sorted} enabledItem={sorted.find((x) => x.name === layerName)} />
      </div>

      {/** Handles all Repository related mutations */}
      {repository && (
        <>
          {openReordering && (
            <LayerElementReorderModal
              onClose={() => setOpenReordering(false)}
              visible={openReordering}
              repository={repository}
              layerElements={sorted}
            />
          )}
          {isCreateDialogOpen && (
            <LayerElementCreateModal onClose={() => setIsCreateDialogOpen(false)} visible={isCreateDialogOpen} repository={repository} />
          )}
        </>
      )}
    </div>
  );
};

export default LayerElementFileTree;
