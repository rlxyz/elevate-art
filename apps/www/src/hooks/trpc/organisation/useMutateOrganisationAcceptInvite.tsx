import produce from "immer";
import { useNotification } from "src/hooks/utils/useNotification";
import { trpc } from "src/utils/trpc";

export const useMutateOrganisationAcceptInvite = () => {
  const ctx = trpc.useContext();
  const { notifySuccess, notifyError } = useNotification();
  return trpc.organisation.acceptInvite.useMutation({
    onSuccess: (data, input) => {
      ctx.organisation.findAll.setData(undefined, (old) => {
        if (!old) return old;
        const next = produce(old, (draft) => {
          draft.push(data);
        });
        notifySuccess(`You have joined ${data.name}.`);
        return next;
      });

      ctx.organisation.findAllInvites.setData(undefined, (old) => {
        if (!old) return old;
        return produce(old, (draft) => {
          draft.splice(
            draft.findIndex((x) => x.id === input.pendingId),
            1,
          );
        });
      });
    },
    onError: (err, variables, context) => {
      notifyError(
        "Something went wrong when accepting the invite. Try again...",
      );
    },
  });
};
