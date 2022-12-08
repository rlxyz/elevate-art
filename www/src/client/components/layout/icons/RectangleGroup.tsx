import type { FC } from 'react'

export const TriangleIcon: FC<React.HTMLAttributes<any>> = ({ className, ...props }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 109 95'
    strokeWidth={1.5}
    stroke='currentColor'
    className={className}
    {...props}
  >
    <path
      d='M52.7679 1C53.5378 -0.333332 55.4622 -0.333333 56.232 1L108.627 91.75C109.396 93.0833 108.434 94.75 106.895 94.75H2.10546C0.565864 94.75 -0.396388 93.0833 0.373412 91.75L52.7679 1Z'
      fill='black'
    />
  </svg>
)
