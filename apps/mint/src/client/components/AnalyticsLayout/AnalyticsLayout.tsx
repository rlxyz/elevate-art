import Card from '@Components/layout/card'
import type { ReactNode } from 'react'

export const AnalyticsLayout = ({ children }: { children: ReactNode }) => <Card>{children}</Card>

const AnalyticsLayoutHeader = ({ title }: { title: string }) => <h2 className='text-xs font-bold'>{title}</h2>
const AnalyticsLayoutBody = ({ children }: { children: ReactNode }) => <>{children}</>

AnalyticsLayout.Header = AnalyticsLayoutHeader
AnalyticsLayout.Body = AnalyticsLayoutBody
