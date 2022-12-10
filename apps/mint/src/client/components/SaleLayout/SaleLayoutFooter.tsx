import type { ReactNode } from 'react'

// export const SaleLayoutFooter = () => {
//   return (
//     <Disclosure>
//       <Disclosure.Button className={clsx('border-mediumGrey p-4 w-full')}>
//         <div className='flex justify-end items-center space-x-1'>
//           <h2 className='text-xs font-normal'>Details</h2>
//           <ChevronRightIcon className='w-3 h-3' />
//         </div>
//       </Disclosure.Button>
//       <Disclosure.Panel className={clsx('p-4 transition-all')}>
//         <div className='text-xs space-x-6 flex justify-between'>
//           <p>Date {1}</p>
//           <span className='font-semibold'>{new Date()?.toLocaleTimeString()}</span>
//         </div>
//       </Disclosure.Panel>
//     </Disclosure>
//   )
// }
export const SaleLayoutFooter = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>
}
