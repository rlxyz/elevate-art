import { Collection } from "@elevateart/db";
import { Search, useInput } from "@elevateart/ui";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon, PlusIcon } from "@heroicons/react/outline";
import { useQueryCollectionFindAll } from "@hooks/trpc/collection/useQueryCollectionFindAll";
import { useQueryLayerElementFindAll } from "@hooks/trpc/layerElement/useQueryLayerElementFindAll";
import clsx from "clsx";
import { Fragment, useEffect, useRef, useState } from "react";
import CollectionCreateDialog from "./CollectionCreateDialog";

const Index = () => {
  const { bindings: inputBindings, state: input } = useInput("");
  const { all: collections, current: collection, mutate, isLoading: isLoadingCollections } = useQueryCollectionFindAll();
  const { all: layers } = useQueryLayerElementFindAll();
  const [selectedCollection, setSelectedPerson] = useState<undefined | Collection>(collection);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const filteredCollections =
    input === ""
      ? collections
      : collections?.filter((collection: Collection) => {
          return collection.name.toLowerCase().includes(input.toLowerCase());
        });
  const [openState, setOpenState] = useState(false);
  const buttonRef = useRef<null | HTMLButtonElement>(null); // useRef<HTMLButtonElement>(null)
  const optionRef = useRef<null | HTMLDivElement>(null); // useRef<HTMLDivElement>(null)
  const handleClickOutside = (event: any) => {
    if (buttonRef.current && !buttonRef.current.contains(event.target) && optionRef.current && !optionRef?.current.contains(event.target)) {
      setOpenState(false);
    } else {
      event.stopPropagation();
    }
  };

  useEffect(() => {
    setSelectedPerson(collection);
  }, [isLoadingCollections, collection?.name]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  return (
    <>
      <Listbox value={selectedCollection} onChange={setSelectedPerson}>
        <Listbox.Button
          ref={buttonRef}
          onClick={() => setOpenState(true)}
          className={clsx(
            !collection ? "h-full animate-pulse rounded-[5px] bg-accents_7 bg-opacity-50" : "border border-border",
            "shadow-xs relative inline-flex h-full w-full cursor-pointer items-center whitespace-nowrap rounded-[5px] p-3 py-3 pl-4 pr-3 align-middle text-xs font-semibold leading-10 text-foreground",
          )}
        >
          <div className={clsx(!collection && "invisible", "flex w-full items-center justify-between")}>
            <div className="flex items-center justify-start space-x-2">
              <div className="h-4 w-4 rounded-full bg-success" />
              <span className="text-xs font-semibold text-foreground">{selectedCollection?.name || ""}</span>
            </div>
            <div>
              <ChevronDownIcon className="h-4 w-4 text-accents_5" />
            </div>
          </div>
        </Listbox.Button>
        <div ref={optionRef} className="absolute">
          <Transition
            show={openState}
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Listbox.Options className="absolute z-10 w-56 py-2">
              <div className="max-h-[20rem] overflow-y-scroll rounded-[5px] shadow-lg ring-1 ring-accents_7 no-scrollbar ">
                <div className=" divide-y divide-accents_7 bg-background">
                  <div className="grid grid-cols-10 gap-x-1 p-2">
                    <div className="col-span-8">
                      <Search isLoading={!collections} {...inputBindings} />
                    </div>
                    <div className="col-span-2">
                      <button
                        className="flex h-full w-full items-center justify-center rounded-[5px] border border-border px-2"
                        onClick={(e: any) => {
                          e.preventDefault();
                          setIsOpenDialog(true);
                          setOpenState(false);
                        }}
                      >
                        <PlusIcon className="h-3 w-3 text-accents_5" />
                      </button>
                    </div>
                  </div>
                  {/* <span className='text-xs text-accents_5'>Collections</span> */}
                  <div className="max-h-[16em] overflow-y-scroll no-scrollbar">
                    {filteredCollections?.map((collection: Collection) => (
                      <Listbox.Option key={collection.id} value={collection}>
                        {/** @todo fix */}
                        <button className={`flex w-full cursor-pointer flex-row justify-between`} onClick={() => mutate({ collection })}>
                          <div className="flex w-full flex-row items-center justify-between px-1">
                            <span
                              className={clsx(
                                "text-xs text-foreground",
                                collection.name === selectedCollection?.name ? "font-semibold" : "font-normal",
                              )}
                            >
                              {collection.name}
                            </span>
                            <div className="flex items-center">
                              {collection.name === "main" && (
                                <span className="mr-1 inline-flex items-center rounded-full border border-border bg-accents_8 bg-opacity-40 py-1 px-2 text-xs font-medium text-foreground">
                                  {"master"}
                                </span>
                              )}
                              {collection.name === selectedCollection?.name && <CheckIcon className="text-blueHighlight h-4 w-4" />}
                            </div>
                          </div>
                        </button>
                      </Listbox.Option>
                    ))}
                  </div>
                </div>
              </div>
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      <CollectionCreateDialog
        onClose={() => {
          setIsOpenDialog(false);
        }}
        isOpen={isOpenDialog}
      />
    </>
  );
};

export default Index;
