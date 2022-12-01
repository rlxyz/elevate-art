import { Popover, Transition } from "@headlessui/react";
import { InformationCircleIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import { Children, Fragment, ReactNode } from "react";

export const Table = ({ children }: { children: ReactNode | ReactNode[] }) => {
  return (
    <div className="flex flex-col">
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full table-auto border-separate border-spacing-x-0 border-spacing-y-0">{children}</table>
      </div>
    </div>
  );
};

const TableHead = ({ children, loading = false }: { children: ReactNode | ReactNode[]; loading?: boolean }) => {
  const childrens = Children.toArray(children);
  return (
    <thead className={clsx(loading ? "animate-pulse bg-accents_7 bg-opacity-50" : "bg-background")}>
      <tr>
        {childrens.map((children, index) => {
          return (
            <th
              key={index}
              className={clsx(
                !loading && index === 0 && "border-mediumGrey rounded-tl-[5px] border-t border-l border-b pl-3",
                !loading && index === childrens.length - 1 && "border-mediumGrey rounded-tr-[5px] border-b border-t border-r pr-3",
                !loading && "border-mediumGrey border-b border-t text-left", // everything else
                "py-2",
              )}
            >
              <div className={clsx(loading && "invisible", "text-darkGrey w-full text-[0.6rem] font-normal uppercase")}>{children}</div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

const TableHeadRow = ({
  title,
  description,
  children,
}: {
  title?: JSX.Element | string;
  description?: JSX.Element | string;
  children?: ReactNode;
}) => {
  return (
    <>
      <span className="text-darkGrey text-[0.65rem] font-normal uppercase">{title}</span>
      {description && (
        <Popover>
          <Popover.Button as={InformationCircleIcon} className="h-3 w-3 bg-accents_8 text-accents_5" />
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute z-10 w-[200px] -translate-x-1/2 transform rounded-[5px] bg-foreground">
              <div className="p-2 shadow-lg">
                <p className="text-[0.65rem] font-normal text-accents_8">{description}</p>
              </div>
            </Popover.Panel>
          </Transition>
        </Popover>
      )}
      {children}
    </>
  );
};

const TableBody = ({ children, loading = false }: { children: ReactNode | ReactNode[]; loading?: boolean }) => {
  return (
    <tbody className={clsx(loading ? "bg-mediumGrey animate-pulse bg-opacity-50" : "bg-white", "divide-mediumGrey divide-y overflow-auto")}>
      {children}
    </tbody>
  );
};

const TableBodyRow = ({
  children,
  current,
  total,
  loading = false,
}: {
  children: ReactNode | ReactNode[];
  current: number;
  total: number;
  loading?: boolean;
}) => {
  const childrens = Children.toArray(children);
  return (
    <tr>
      {childrens.map((children, index) => {
        return (
          <td
            key={index}
            className={clsx(
              current === total - 1 && "border-b border-border",
              current === total - 1 && index == 0 && "rounded-bl-[5px]",
              current === total - 1 && index == childrens.length - 1 && "rounded-br-[5px]",
              index === 0 && "border-l pl-3",
              index === childrens.length - 1 && "border-r pr-3",
              index === 0 && "w-[7.5%]", // @todo this needs to be fixed!
              index === 1 && "w-[15%]", // @todo this needs to be fixed!
              index === 2 && "w-[25%]", // @todo this needs to be fixed!
              index === 3 && "w-[30%]",
              index === 4 && "w-[15%]",
              current !== 0 && "border-t",
              "border-mediumGrey text-ellipsis whitespace-nowrap py-2 text-left text-xs", // everything else
            )}
          >
            <div className={clsx(loading && "invisible")}>{children}</div>
          </td>
        );
      })}
    </tr>
  );
};

const TableBodyRowData = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

Table.Head = TableHead;
TableHead.Row = TableHeadRow;
Table.Body = TableBody;
TableBody.Row = TableBodyRow;
TableBodyRow.Data = TableBodyRowData;
