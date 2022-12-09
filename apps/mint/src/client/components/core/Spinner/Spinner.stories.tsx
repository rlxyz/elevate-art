import { ComponentMeta } from '@storybook/react'
import { Spinner } from 'src/client/components/Spinner/Spinner'

export default {
  title: 'Spinner',
  component: Spinner,
} as ComponentMeta<typeof Spinner>

export const BasicSpinner = () => <Spinner />
