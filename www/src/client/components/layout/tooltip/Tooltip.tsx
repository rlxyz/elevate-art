import { Popover, Transition } from '@headlessui/react'
import { ElementType, forwardRef, Fragment } from 'react'

interface Props {
  variant: 'success' | 'error' | 'warning' | 'info'
  as: ElementType<any> | undefined
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>
export type TooltipProps = Props & NativeAttrs

const Tooltip = forwardRef<HTMLAnchorElement, React.PropsWithChildren<Props>>(
  ({ variant, as, children, ...props }: React.PropsWithChildren<TooltipProps>) => {
    return (
      <Popover>
        <Popover.Button as={as} className='text-darkGrey w-3 h-3 bg-lightGray' {...props} />
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
              <p className='text-[0.65rem] text-white font-normal whitespace-pre-wrap normal-case'>
                This trait can be used for situations where you dont want to assign a trait to a layer. It cannot be renamed or deleted.
              </p>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
    )
  }
)

export default Tooltip
