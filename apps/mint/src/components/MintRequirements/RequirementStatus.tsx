import React from 'react'

interface Props {
  passed?: boolean
}

export const RequirementStatus: React.FC<Props> = ({ passed }) => {
  if (passed) {
    return <img src="/images/check.svg" className="mr-6" alt="Eligible" />
  }

  return <img src="/images/cross.svg" className="mr-6" alt="Not Not eligible" />
}
