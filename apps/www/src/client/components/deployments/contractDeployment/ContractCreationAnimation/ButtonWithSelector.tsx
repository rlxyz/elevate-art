import clsx from 'clsx'
import type { FC, ReactNode } from 'react'

export const ButtonWithSelector: FC<{ onClick: () => void; disabled: boolean; children: ReactNode }> = ({
  onClick,
  disabled,
  children,
}) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'relative z-1 rounded-full border border-mediumGrey bg-white p-sm transition hover:bg-lightGray false text-darkGrey p-1.5 text-sm font-medium',
        disabled && 'opacity-0 pointer-events-none'
      )}
    >
      {children}
    </button>
  )
}
