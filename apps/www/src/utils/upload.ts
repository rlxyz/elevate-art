import { TraitElement } from "@hooks/trpc/layerElement/useQueryLayerElementFindAll";
import produce from "immer";
import { FileWithPath } from "react-dropzone";
import { TraitElementUploadState } from "src/components/layout/upload/upload-display";
import { env } from "src/env/client.mjs";
src / hooks / trpc / layerElement / useQueryLayerElementFindAll;

export type ParseLayerElementFolderInput = {
  traitElements: TraitElement[];
  files: FileWithPath[];
  layerElementName?: string;
};
export type ParseLayerElementFolderOutput = {
  [key: string]: TraitElementUploadState[];
};

/**
 * Note, this function is dynamic in that it infers the LayerElement & TraitElement name from the file path.
 * We also ensure that if a TraitElement already exists, or is readonly, we mark it as such (however, we still save the file data in the return)
 * @param opts ParseLayerElementFolderInput; a list of existing TraitElements, and a list of files
 * @todo ensure user doesn't accidently drop in his entire fucking Document folder like a dumbass.
 */
export const parseLayerElementFolder = (opts: ParseLayerElementFolderInput): ParseLayerElementFolderOutput => {
  const { layerElementName, files, traitElements } = opts;
  const existing = traitElements.map((x) => x.name);
  const readonly = traitElements.filter((x) => x.readonly).map((x) => x.name);

  return files.reduce((acc, file: FileWithPath) => {
    /**
     * Little validation on path array since its optional from FileWithPath
     * Just ignore this. Should always work.
     */
    const pathArray = file.path?.split("/");
    if (!pathArray) return acc;

    /**
     * Find TraitElement & LayerElement name is exist
     * @note l === layerElement name, t === traitElement name
     * @note also, technically, the TraitElement is always the last, followed by the LayerElement
     * @todo validate this traitElementName, ensure images are .png's
     */
    const l = pathArray[-2] || layerElementName; // used for depth of 1 upload
    const t = file.name.replace(".png", "");
    if (!l || !t) return acc;

    /**
     * Append to the data structure
     * @note we use immer to ensure in-place mutation, its faster, i think.
     */
    return produce(acc, (draft) => {
      const validSize = validateFileSize(file);
      const upload: TraitElementUploadState = {
        name: t,
        imageUrl: URL.createObjectURL(file),
        size: file.size,
        uploaded: false,
        type: existing.includes(t) ? "existing" : readonly.includes(t) ? "readonly" : validSize ? "new" : "invalid",
      };
      draft[l] ? draft[l]?.push(upload) : (draft[l] = [upload]);
    });
  }, {} as ParseLayerElementFolderOutput);
};

export const validateFileSize = (file: FileWithPath): boolean => {
  return file.size <= env.NEXT_PUBLIC_IMAGE_MAX_BYTES_ALLOWED;
};

export const validateFolderDepth = (files: FileWithPath[], folderDepth: number): boolean => {
  const depth = folderDepth + 1; // + 1 because we are adding the root folder
  return files.filter((file) => file.path?.split("/").length !== depth).length === 0;
};
