import { ArrowTopRightIcon } from "@components/layout/icons/ArrowTopRightIcon";
import NextLinkComponent from "@components/layout/link/NextLink";
import { Menu } from "@headlessui/react";
import { LinkIcon, PencilIcon, TrashIcon } from "@heroicons/react/outline";
import { LayerElement } from "@hooks/trpc/layerElement/useQueryLayerElementFindAll";
import { useNotification } from "@hooks/utils/useNotification";
import { useRepositoryRoute } from "@hooks/utils/useRepositoryRoute";
import { CollectionNavigationEnum } from "@utils/enums";
import clsx from "clsx";
import router from "next/router";
import { FC, useState } from "react";
import { timeAgo } from "src/utils/time";
import LayerElementDeleteModal from "./LayerElementDeleteModal";
import LayerElementRenameModal from "./LayerElementRenameModal";

interface Props {
  item: LayerElement;
  enabled: boolean;
}

export type ModalProps = Props & Omit<React.HTMLAttributes<any>, keyof Props>;

/**
 * This component allows the end user to reorder items by dragging the ReorderItem up/down to it's desired location
 *
 * @todo rework the Link component being used here
 */
export const LayerElementFileTreeItem: FC<ModalProps> = ({ item, enabled, className, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { notifyInfo } = useNotification();
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const { mainRepositoryHref } = useRepositoryRoute();

  const onClipboardCopy = () => {
    const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : "";
    navigator.clipboard.writeText(`${origin}/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Rarity}/${item.name}`);
    notifyInfo("Copied to clipboard");
  };

  return (
    <div
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      className={clsx(className, "relative hover:font-semibold", enabled && "bg-lightGray font-semibold")}
    >
      <NextLinkComponent href={`/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Rarity}/${item.name}`} className="py-2">
        <div className="relative flex w-full items-center">
          <span className="mx-7 flex w-full items-center overflow-hidden whitespace-nowrap text-xs" {...props}>
            {item.name}
          </span>
        </div>
      </NextLinkComponent>
      {isHovered && (
        <Menu>
          <Menu.Items>
            <Menu.Item
              as="button"
              type="button"
              onClick={() => {
                setIsDeleteDialogOpen(true);
              }}
            >
              <TrashIcon className="h-3 w-3" />
              <span>Delete</span>
            </Menu.Item>

            <Menu.Item as="button" type="button" onClick={onClipboardCopy}>
              <LinkIcon className="h-3 w-3" />
              <span>Copy Link</span>
            </Menu.Item>

            <Menu.Item
              as={NextLinkComponent}
              href={`/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Rarity}/${item.name}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ArrowTopRightIcon className="h-3 w-3" />
              <span>Open in new window</span>
            </Menu.Item>

            <Menu.Item as="button" onClick={() => setIsRenameDialogOpen(true)}>
              <PencilIcon className="h-3 w-3" />
              <span>Rename</span>
            </Menu.Item>
          </Menu.Items>

          <Menu.Items>
            <div className="text-darkGrey space-x-1 overflow-hidden text-ellipsis whitespace-nowrap text-[0.6rem]">
              <span>Last Edited</span>
              <span>{timeAgo(item.updatedAt)}</span>
            </div>
            <div className="text-darkGrey space-x-1 overflow-hidden text-ellipsis whitespace-nowrap text-[0.6rem]">
              <span>Created</span>
              <span>{timeAgo(item.createdAt)}</span>
            </div>
          </Menu.Items>
        </Menu>
      )}
      <LayerElementDeleteModal
        onClose={() => setIsDeleteDialogOpen(false)}
        visible={isDeleteDialogOpen}
        layerElement={item}
        onSuccess={() => {
          if (!enabled) return;
          router.push(`/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Rarity}`);
        }}
      />
      <LayerElementRenameModal onClose={() => setIsRenameDialogOpen(false)} visible={isRenameDialogOpen} layerElement={item} />
    </div>
  );
};
