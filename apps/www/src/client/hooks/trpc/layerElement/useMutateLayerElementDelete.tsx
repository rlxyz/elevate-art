import produce from "immer";
import { trpc } from "src/client/utils/trpc";
import { useMutationContext } from "../useMutationContext";

export const useMutateLayerElementDelete = () => {
  const { ctx, repositoryId, notifyError, notifySuccess } =
    useMutationContext();
  return trpc.layerElement.delete.useMutation({
    onSuccess: (data, variables) => {
      ctx.layerElement.findAll.setData({ repositoryId }, (old) => {
        if (!old) return old;
        const next = produce(old, (draft) => {
          const index = draft.findIndex(
            (layer) => layer.id === variables.layerElementId,
          );
          draft.splice(index, 1);
          draft = draft.map((x) => {
            if (x.priority > data.priority) {
              x.priority = x.priority - 1;
            }
            return x;
          });
        });
        notifySuccess("Layer deleted successfully");
        return next;
      });
    },
    onError: (err) => {
      notifyError(err.message);
    },
  });
};
