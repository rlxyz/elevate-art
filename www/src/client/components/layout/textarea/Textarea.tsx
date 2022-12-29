import clsx from 'clsx'
import React, { useEffect, useMemo, useState } from 'react'

interface Props {
  value?: string
  initialValue?: string
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
  className?: string
}

const defaultProps = {
  initialValue: '',
  disabled: false,
  readOnly: false,
  className: '',
}

type NativeAttrs = Omit<React.TextareaHTMLAttributes<any>, keyof Props>
export type TextareaProps = Props & NativeAttrs

const TextareaComponent = React.forwardRef<HTMLTextAreaElement, React.PropsWithChildren<TextareaProps>>(
  ({ disabled, readOnly, onFocus, onBlur, onChange, className, initialValue, value, placeholder, ...props }, ref) => {
    // const textareaRef = useRef<HTMLTextAreaElement | null>(ref)
    // useImperativeHandle(ref, () => textareaRef.current)

    const isControlledComponent = useMemo(() => value !== undefined, [value])
    const [selfValue, setSelfValue] = useState<string>(initialValue || '')
    const [hover, setHover] = useState<boolean>(false)

    const changeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (disabled || readOnly) return
      setSelfValue(event.target.value)
      onChange && onChange(event)
    }
    const focusHandler = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setHover(true)
      onFocus && onFocus(e)
    }
    const blurHandler = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setHover(false)
      onBlur && onBlur(e)
    }

    useEffect(() => {
      if (isControlledComponent) {
        setSelfValue(value as string)
      }
    }, [value])

    const controlledValue = isControlledComponent ? { value: selfValue } : { defaultValue: initialValue }
    const textareaProps = {
      ...props,
      ...controlledValue,
    }

    return (
      <div
        className={clsx(
          'inline-flex box-border select-none border border-mediumGrey rounded-[5px] min-w-[12.5rem] max-w-[95vw] w-full m-0',
          hover && 'border-blueHighlight ring-1 ring-blueHighlight',
          disabled && 'bg-mediumGrey cursor-not-allowed',
          className
        )}
      >
        <textarea
          ref={ref}
          disabled={disabled}
          placeholder={placeholder}
          readOnly={readOnly}
          onFocus={focusHandler}
          onBlur={blurHandler}
          onChange={changeHandler}
          className={clsx(
            'bg-transparent shadow-none block text-xs w-full border-none outline-none p-2 rounded-[5px]',
            'focus:outline-none focus:ring-1 focus:border-blueHighlight focus:ring-blueHighlight',
            disabled && 'cursor-not-allowed'
          )}
          {...textareaProps}
        />
      </div>
    )
  }
)

TextareaComponent.defaultProps = defaultProps
TextareaComponent.displayName = 'Textarea'
export default TextareaComponent
