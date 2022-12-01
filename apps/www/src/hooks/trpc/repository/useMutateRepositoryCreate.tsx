import { Repository } from "@elevateart/db";
import produce from "immer";
import { Dispatch, SetStateAction } from "react";
import { FileWithPath } from "react-dropzone";
import { UploadState } from "src/components/layout/upload/upload";
import { TraitElementUploadState } from "src/components/layout/upload/upload-display";
import { env } from "src/env/client.mjs";
import { useQueryOrganisationFindAll } from "src/hooks/trpc/organisation/useQueryOrganisationFindAll";
import { useNotification } from "src/hooks/utils/useNotification";
import { createCloudinaryFormData, getRepositoryLayerNames, getRepositoryUploadLayerObjectUrls } from "src/utils/cloudinary";
import { trpc } from "src/utils/trpc";

export const useMutateRepositoryCreate = ({ setRepository }: { setRepository: Dispatch<SetStateAction<null | Repository>> }) => {
  const ctx = trpc.useContext();
  const { current: organisation, isLoading } = useQueryOrganisationFindAll();
  const { mutateAsync: createRepository } = trpc.repository.create.useMutation();
  const { notifyError, notifySuccess } = useNotification();

  const mutate = async ({
    files,
    setUploadedFiles,
    setUploadState,
  }: {
    files: FileWithPath[];
    setUploadedFiles: Dispatch<SetStateAction<{ [key: string]: TraitElementUploadState[] }>>;
    setUploadState: (state: UploadState) => void;
  }) => {
    // step 0: validate organisation
    if (isLoading || !organisation) {
      setUploadState("error");
      notifyError("We couldnt find your team. Please refresh the page to try again.");
      return;
    }

    const repositoryName: string = (files[0]?.path?.split("/")[1] as string) || "";
    const layers = getRepositoryUploadLayerObjectUrls(files);

    try {
      setUploadedFiles(layers);
      notifySuccess("Upload format is correct. We are creating the project for you.");
      const response = await createRepository({
        organisationId: organisation.id,
        name: repositoryName,
        layerElements: getRepositoryLayerNames(layers),
      });
      const { id: repositoryId } = response;
      setRepository(response);
      ctx.repository.findByName.setData({ name: response.name }, response);

      notifySuccess("Project created. We are uploading the images now. Do not leave this page!");
      setUploadState("uploading");

      const filePromises = files.map(async (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          const pathArray = String(file.path).split("/");
          const layerName = pathArray[2];
          const traitName = pathArray[3]?.replace(".png", "");
          if (!traitName || !layerName) return;
          const traitElement = response.layers.find((x) => x.name === layerName)?.traitElements.find((x) => x.name === traitName);
          if (!traitElement) return;
          reader.onabort = () =>
            reject({
              traitElementId: traitElement.id,
              error: "file reading was aborted",
            });
          reader.onerror = () =>
            reject({
              traitElementId: traitElement.id,
              error: "file reading has failed",
            });
          reader.onload = async () => {
            try {
              const response = await fetch(`https://api.cloudinary.com/v1_1/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: "post",
                body: createCloudinaryFormData(file, traitElement, repositoryId),
              });
              const data = await response.json();
              const { secure_url } = data as { secure_url: string };
              setUploadedFiles((state) =>
                produce(state, (draft) => {
                  const trait = draft[layerName]?.find((x) => x.name === traitName);
                  if (!trait) return;
                  trait.uploaded = true;
                }),
              );
              resolve({
                traitElementId: traitElement.id,
                imageUrl: secure_url,
              });
            } catch (err) {
              reject({
                traitElementId: traitElement.id,
                error: "something went wrong when uploading",
              });
            }
          };
          reader.readAsArrayBuffer(file);
        });
      });

      await Promise.all(filePromises).then((data) => {
        setUploadState("done");
        notifySuccess("Traits created and uploaded successfully");
      });
      return;
    } catch (e) {
      setUploadState("error");
      notifyError("Something went wrong. Please refresh the page to try again.");
      return;
    }
  };

  return { mutate };
};
