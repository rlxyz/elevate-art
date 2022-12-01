import produce from "immer";
import { trpc } from "src/utils/trpc";
import { useMutationContext } from "../useMutationContext";

export const useMutateLayerElementUpdateOrder = () => {
  const { ctx, repositoryId, notifyError, notifySuccess } =
    useMutationContext();
  return trpc.layerElement.updateOrder.useMutation({
    onSuccess: (_, variable) => {
      const { layerElements } = variable;
      ctx.layerElement.findAll.setData({ repositoryId }, (old) => {
        if (!old) return old;
        const next = produce(old, (draft) => {
          layerElements.forEach(({ layerElementId: id, priority }) => {
            const layer = draft.find((l) => l.id === id);
            if (layer) {
              layer.priority = priority;
            }
          });
          draft = draft.sort((a, b) => a.priority - b.priority);
        });
        notifySuccess(
          `You have reordered the layers. All collections have been regenerated with the new order.`,
        );
        return next;
      });
    },
    onError: (err, variables, context) => {
      notifyError("Something went wrong when reordering layers. Try again...");
    },
  });
};
