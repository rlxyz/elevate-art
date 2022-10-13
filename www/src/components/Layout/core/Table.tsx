import { Popover, Transition } from '@headlessui/react'
import { InformationCircleIcon } from '@heroicons/react/outline'
import clsx from 'clsx'
import { Children, Fragment, ReactNode } from 'react'

export const Table = ({ children }: { children: ReactNode | ReactNode[] }) => {
  return <table className='border-separate border-spacing-x-0 border-spacing-y-0 min-w-full'>{children}</table>
}

const TableHead = ({ children }: { children: ReactNode | ReactNode[] }) => {
  const childrens = Children.toArray(children)
  return (
    <thead className='bg-white'>
      <tr>
        {childrens.map((children, index) => {
          return (
            <th
              className={clsx(
                index === 0 && 'border-t border-l rounded-tl-[5px] border-mediumGrey pl-3',
                index === childrens.length - 1 && 'pr-3 border-t border-r rounded-tr-[5px] border-mediumGrey',
                'text-left border-t border-mediumGrey py-2' // everything else
              )}
            >
              {children}
            </th>
          )
        })}
      </tr>
    </thead>
  )
}
const TableHeadRow = ({ title, description }: { title?: JSX.Element; description?: JSX.Element }) => {
  return (
    <div className='flex items-center space-x-1'>
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
    </div>
  )
}

const TableBody = ({ children }: { children: ReactNode | ReactNode[] }) => {
  return <tbody className='divide-y divide-mediumGrey'>{children}</tbody>
}

const TableBodyRow = ({ children }: { children: ReactNode | ReactNode[] }) => {
  const childrens = Children.toArray(children)
  return (
    <tr>
      {childrens.map((children, index) => {
        return (
          <th
            className={clsx(
              index === 0 && 'border-t border-l rounded-tl-[5px] border-mediumGrey pl-3',
              index === childrens.length - 1 && 'pr-3 border-t border-r rounded-tr-[5px] border-mediumGrey',
              'text-left border-t border-mediumGrey py-2' // everything else
            )}
          >
            {children}
          </th>
        )
      })}
    </tr>
  )
}

const TableBodyRowData = ({ children, last = false }: { children: ReactNode; last?: boolean }) => {
  return <td className={clsx(last && 'border-b rounded-bl-[5px]')}>{children}</td>
}

Table.Head = TableHead
TableHead.Row = TableHeadRow
Table.Body = TableBody
TableBody.Row = TableBodyRow
TableBodyRow.Data = TableBodyRowData
