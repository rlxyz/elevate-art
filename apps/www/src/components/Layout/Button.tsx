import cn from 'clsx'
import { AnchorHTMLAttributes, ButtonHTMLAttributes, FC, JSXElementConstructor } from 'react'
import Loader from './Loader'

/**
 * All the component types allowed by the Button component.
 */
export type ButtonComponentType = 'button' | 'a' | JSXElementConstructor<any>

/**
 * Base props of the Button component.
 */
export interface ButtonProps<C extends ButtonComponentType = 'button'> {
  href?: string
  className?: string
  variant?: 'primary' | 'secondary' | 'success' | 'icon' | 'ghost' | 'link'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  active?: boolean
  type?: 'submit' | 'reset' | 'button'
  Component?: C
  width?: string | number
  loading?: boolean
  disabled?: boolean
}

/**
 * The HTML props allowed by the Button component. These
 * props depend on the used component type (C).
 */
export type ButtonHTMLType<C extends ButtonComponentType = 'button'> = C extends 'a'
  ? AnchorHTMLAttributes<HTMLAnchorElement>
  : ButtonHTMLAttributes<HTMLButtonElement>

type ButtonFC<C extends ButtonComponentType = 'button'> = FC<ButtonHTMLType<C> & ButtonProps<C>>

type ButtonType = <C extends ButtonComponentType = 'button'>(...args: Parameters<ButtonFC<C>>) => ReturnType<ButtonFC<C>>

const Button: ButtonFC = (props) => {
  const {
    width,
    active,
    children,
    variant = 'primary',
    Component = 'button',
    disabled = false,
    loading = false,
    style = {},
    size = 'md',
    className,
    ...rest
  } = props

  const rootClassName = cn(
    // missing transition
    'relative inline-flex items-center cursor-pointer p-3 text-white text-xs font-semibold shadow-xs align-middle whitespace-nowrap leading-10',
    'disabled:bg-disabledGray disabled:cursor-not-allowed disabled:text-white',
    size == 'sm' && 'leading-9 text-xs min-width-[auto]',
    size == 'md' && 'h-10 leading-10 text-xs',
    size == 'lg' && 'h-11 leading-11 text-xs',
    variant === 'secondary' && 'bg-white text-black border border-border',
    variant === 'primary' && 'rounded-[5px] bg-black justify-center',
    variant === 'icon' && 'bg-white disabled:bg-white disabled:text-accents_7 justify-center',
    variant === 'ghost' && 'text-black',
    variant === 'link' && 'cursor-pointer flex flex-row w-full justify-between hover:bg-accents_8',
    className
  )

  return (
    <Component
      aria-pressed={active}
      data-variant={variant}
      className={rootClassName}
      disabled={disabled}
      style={{
        width,
        ...style,
      }}
      {...rest}
    >
      {loading ? (
        <i className='m-0 flex'>
          <Loader />
        </i>
      ) : (
        children
      )}
    </Component>
  )
}

// Our Button component is built thinking of it as a button,
// but it can also be used as a link and include the anchor props
export default Button as ButtonType
