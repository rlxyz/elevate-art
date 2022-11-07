import { Popover, Transition } from '@headlessui/react'
import { InformationCircleIcon } from '@heroicons/react/outline'
import clsx from 'clsx'
import { Children, Fragment, ReactNode } from 'react'

export const Table = ({ children }: { children: ReactNode | ReactNode[] }) => {
  return (
    <div className='flex flex-col'>
      <div className='inline-block min-w-full align-middle'>
        <table className='table-auto border-separate border-spacing-x-0 border-spacing-y-0 min-w-full'>{children}</table>
      </div>
    </div>
  )
}

const TableHead = ({ children, loading = false }: { children: ReactNode | ReactNode[]; loading?: boolean }) => {
  const childrens = Children.toArray(children)
  return (
    <thead className={clsx(loading ? 'bg-mediumGrey bg-opacity-50 animate-pulse' : 'bg-white')}>
      <tr>
        {childrens.map((children, index) => {
          return (
            <th
              key={index}
              className={clsx(
                !loading && index === 0 && 'border-t border-l border-mediumGrey rounded-tl-[5px] pl-3',
                !loading && index === childrens.length - 1 && 'pr-3 border-t border-r border-mediumGrey rounded-tr-[5px]',
                !loading && 'text-left border-t border-mediumGrey', // everything else
                'py-2'
              )}
            >
              <div className={clsx(loading && 'invisible', 'text-[0.6rem] w-full font-normal text-darkGrey uppercase')}>
                {children}
              </div>
            </th>
          )
        })}
      </tr>
    </thead>
  )
}
const TableHeadRow = ({
  title,
  description,
  children,
}: {
  title?: JSX.Element | string
  description?: JSX.Element | string
  children?: ReactNode
}) => {
  return (
    <>
      <span className='text-[0.65rem] uppercase font-normal text-darkGrey'>{title}</span>
      {description && (
        <Popover>
          <Popover.Button as={InformationCircleIcon} className='text-darkGrey w-3 h-3 bg-lightGray' />
          <Transition
            as={Fragment}
            enter='transition ease-out duration-200'
            enterFrom='opacity-0 translate-y-1'
            enterTo='opacity-100 translate-y-0'
            leave='transition ease-in duration-150'
            leaveFrom='opacity-100 translate-y-0'
            leaveTo='opacity-0 translate-y-1'
          >
            <Popover.Panel className='absolute w-[200px] bg-black z-10 -translate-x-1/2 transform rounded-[5px]'>
              <div className='p-2 shadow-lg'>
                <p className='text-[0.65rem] text-white font-normal'>{description}</p>
              </div>
            </Popover.Panel>
          </Transition>
        </Popover>
      )}
      {children}
    </>
  )
}

const TableBody = ({ children, loading = false }: { children: ReactNode | ReactNode[]; loading?: boolean }) => {
  return (
    <tbody className={clsx(loading ? 'bg-mediumGrey bg-opacity-50 animate-pulse' : 'bg-white', 'divide-y divide-mediumGrey')}>
      {children}
    </tbody>
  )
}

const TableBodyRow = ({
  children,
  current,
  total,
  loading = false,
}: {
  children: ReactNode | ReactNode[]
  current: number
  total: number
  loading?: boolean
}) => {
  const childrens = Children.toArray(children)
  return (
    <tr>
      {childrens.map((children, index) => {
        return (
          <td
            key={index}
            className={clsx(
              current === total - 1 && 'border-b border-mediumGrey',
              current === total - 1 && index == 0 && 'rounded-bl-[5px]',
              current === total - 1 && index == childrens.length - 1 && 'rounded-br-[5px]',
              index === 0 && 'pl-3 border-l',
              index === childrens.length - 1 && 'pr-3 border-r',
              index === 0 && 'w-[7.5%]', // @todo this needs to be fixed!
              index === 1 && 'w-[15%]', // @todo this needs to be fixed!
              index === 2 && 'w-[25%]', // @todo this needs to be fixed!
              index === 3 && 'w-[30%]',
              index === 4 && 'w-[15%]',
              'text-left border-t border-mediumGrey py-2 text-xs whitespace-nowrap text-ellipsis' // everything else
            )}
          >
            <div className={clsx(loading && 'invisible')}>{children}</div>
          </td>
        )
      })}
    </tr>
  )
}

const TableBodyRowData = ({ children }: { children: ReactNode }) => {
  return <>{children}</>
}

Table.Head = TableHead
TableHead.Row = TableHeadRow
Table.Body = TableBody
TableBody.Row = TableBodyRow
TableBodyRow.Data = TableBodyRowData
