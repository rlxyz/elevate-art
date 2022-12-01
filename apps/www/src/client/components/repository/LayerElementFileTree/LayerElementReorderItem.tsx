import { PreviewImageCardStandaloneNoNone } from "@components/collection/CollectionPreviewImage";
import { SelectorIcon } from "@heroicons/react/outline";
import { LayerElement } from "@hooks/trpc/layerElement/useQueryLayerElementFindAll";
import { Repository } from "@prisma/client";
import clsx from "clsx";
import {
  AnimatePresence,
  Reorder,
  useDragControls,
  useMotionValue,
} from "framer-motion";
import { FC, useEffect, useState } from "react";
import ModalComponent from "src/client/components/layout/modal/Modal";
import * as v from "src/shared/compiler";
import { useMutateLayerElementUpdateOrder } from "../../../hooks/trpc/layerElement/useMutateLayerElementUpdateOrder";
import { useRaisedShadow } from "../../../hooks/utils/useRaisedShadow";
import { FormModalProps } from "./LayerElementDeleteModal";

interface LayerElementRenameProps extends FormModalProps {
  layerElements: LayerElement[];
  repository: Repository;
}

interface Props {
  repositoryId: string;
  item: LayerElement;
}

export type ReorderItemProps = Props &
  Omit<React.HTMLAttributes<any>, keyof Props>;

export const LayerElementReorderItem: FC<ReorderItemProps> = ({
  repositoryId,
  item,
  className,
  ...props
}) => {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={item}
      id={item.toString()}
      style={{ boxShadow, y }}
      dragListener={false}
      dragControls={dragControls}
      className={clsx(
        className,
        "bg-lightGray border-mediumGrey relative flex w-full cursor-move items-center rounded-[5px] border px-4 py-2",
      )}
      onPointerDown={(e) => {
        e.preventDefault();
        dragControls.start(e);
      }}
    >
      <SelectorIcon className="absolute h-3 w-3" />
      <span
        className="mx-7 flex w-full items-center overflow-hidden whitespace-nowrap text-xs"
        {...props}
      >
        {item.name}
      </span>
    </Reorder.Item>
  );
};

const LayerElementReorderModal: FC<LayerElementRenameProps> = ({
  repository,
  layerElements,
  visible,
  onClose,
}) => {
  const sorted = layerElements.sort((a, b) => a.priority - b.priority);
  const [items, setItems] = useState<LayerElement[]>(sorted);
  const { mutate, isLoading } = useMutateLayerElementUpdateOrder();

  useEffect(() => {
    setItems(layerElements);
  }, [sorted.length]);

  if (!repository) return null;

  const elements = v
    .one(
      v.parseLayer(
        sorted.map((l) => ({
          ...l,
          traits: l.traitElements
            .filter((x) => !x.readonly)
            .map((t) => ({
              ...t,
              weight: t.weight || 1, // override weight to 1 if it's null
              rules: [...t.rulesPrimary, ...t.rulesSecondary].map(
                ({
                  condition,
                  primaryTraitElementId: left,
                  secondaryTraitElementId: right,
                }) => ({
                  type: condition as v.RulesType,
                  with: left === t.id ? right : left,
                }),
              ),
            })),
        })),
      ),
      v.seed("", "", 1, ""),
    )
    .reverse();

  /** Maps Reordered List to Element */
  const orderedElements: [string, string][] = [];
  items.map((item, index) => {
    const element = elements[item.priority];
    if (!element) return;
    orderedElements.push(element);
  });
  orderedElements.reverse();

  return (
    <ModalComponent
      visible={visible}
      onClose={() => onClose()}
      title={`Reorder Layers`}
      description={`This action will be applied to all collections automatically.`}
      isLoading={isLoading}
      className="w-[600px]"
      onClick={(e) => {
        e.preventDefault();
        mutate(
          {
            layerElements: items.map(({ id }, index) => ({
              layerElementId: id,
              priority: index,
            })),
          },
          { onSettled: onClose },
        );
      }}
    >
      <div className="grid grid-cols-10 gap-x-6">
        <div className="col-span-5">
          <AnimatePresence>
            <Reorder.Group
              axis="y"
              layoutScroll
              values={items}
              className="flex max-h-[calc(100vh-17.5rem)] flex-col space-y-2 overflow-hidden overflow-y-scroll rounded-[5px] p-2 no-scrollbar"
              onReorder={setItems}
            >
              {items.map((x) => (
                <LayerElementReorderItem
                  key={x.id}
                  item={x}
                  repositoryId={repository.id}
                />
              ))}
            </Reorder.Group>
          </AnimatePresence>
        </div>
        <div className="relative col-span-5 h-full w-full">
          <PreviewImageCardStandaloneNoNone
            id={0}
            elements={orderedElements}
            collection={{
              id: "",
              name: "reorder",
              type: "",
              totalSupply: 1,
              generations: 1,
              createdAt: new Date(),
              updatedAt: new Date(),
              repositoryId: repository.id,
            }}
            layers={items}
          />
        </div>
      </div>
    </ModalComponent>
  );
};

export default LayerElementReorderModal;
