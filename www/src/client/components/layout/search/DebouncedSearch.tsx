import React from 'react'
import SearchComponent from 'src/client/components/layout/search/Search'

export const DebouncedSearchComponent = ({
  value: initialValue,
  onChange,
  debounce = 100,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) => {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return <SearchComponent {...props} onChange={(e) => setValue(e.target.value)} />
}
