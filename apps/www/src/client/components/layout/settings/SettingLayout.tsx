import clsx from 'clsx'
import React, { forwardRef } from 'react'

export interface Props {
  className?: string
  withSaveButton?: boolean
  disabled?: boolean
}

export type SettingLayoutProps = Props & Omit<React.HTMLAttributes<any>, keyof Props>

const SettingLayout = forwardRef<HTMLFormElement, React.PropsWithChildren<SettingLayoutProps>>(
  ({ withSaveButton = true, disabled = true, children, className, ...props }) => {
    const childrens = React.Children.toArray(children)
    return (
      <form {...props} className={clsx(className, 'border border-mediumGrey rounded-[5px]')}>
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
        <div className='w-full p-6 flex items-center h-[3rem] rounded-bl-[5px] rounded-br-[5px] bg-lightGray text-xs justify-end border-t border-t-mediumGrey'>
          {withSaveButton && (
            <button
              disabled={disabled}
              type='submit'
              className={clsx(
                'bg-blueHighlight text-white text-xs disabled:bg-lightGray disabled:text-darkGrey disabled:cursor-not-allowed border border-mediumGrey px-3 py-1 rounded-[5px]',
                disabled && 'cursor-not-allowed'
              )}
            >
              Save
            </button>
          )}
        </div>
      </form>
    )
  }
)

SettingLayout.displayName = 'SettingLayout'
export default SettingLayout
