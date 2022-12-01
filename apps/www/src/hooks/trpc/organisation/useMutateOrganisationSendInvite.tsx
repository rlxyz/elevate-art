import produce from "immer";
import { useNotification } from "src/hooks/utils/useNotification";
import { trpc } from "src/utils/trpc";

export const useMutateOrganisationSendInvite = () => {
  const ctx = trpc.useContext();
  const { notifySuccess, notifyError } = useNotification();
  return trpc.organisation.sendInvite.useMutation({
    onSuccess: (data, variables) => {
      ctx.organisation.findAll.setData(undefined, (old) => {
        if (!old) return old;
        const next = produce(old, (draft) => {
          const index = draft.findIndex((x) => x.id === data.id);
          if (index === -1) return;
          draft.splice(index, 1, data);
        });
        notifySuccess(`You have joined ${data.name}.`);
        return next;
      });
    },
    onError: (err) => {
      notifyError(err.message);
    },
  });
};
