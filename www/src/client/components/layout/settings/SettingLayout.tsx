import clsx from 'clsx'
import React, { forwardRef } from 'react'

export interface Props {
  className?: string
  withSaveButton?: boolean
}

export type SettingLayoutProps = Props & Omit<React.HTMLAttributes<any>, keyof Props>

const SettingLayout = forwardRef<HTMLFormElement, React.PropsWithChildren<SettingLayoutProps>>(
  ({ withSaveButton = true, children, className, ...props }) => {
    const childrens = React.Children.toArray(children)
    return (
      <form {...props} className={'border border-mediumGrey rounded-[5px]'}>
        <div
          className={clsx(
            className,
            'bg-background transition-all rounded-tl-[5px] rounded-tr-[5px] border-mediumGrey box-border p-6 space-y-6'
          )}
        >
          {childrens.map((child, index) => {
            return (
              <div className='' key={index}>
                {child}
              </div>
            )
          })}
        </div>
        <div className='w-full p-6 flex items-center h-[3rem] bg-lightGray text-xs justify-end border-t border-t-mediumGrey'>
          {withSaveButton && (
            <div className='border border-mediumGrey px-4 py-2 rounded-[5px]'>
              <button className='text-darkGrey'>Save</button>
            </div>
          )}
        </div>
      </form>
    )
  }
)

SettingLayout.displayName = 'SettingLayout'
export default SettingLayout
