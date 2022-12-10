import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Button } from 'src/client/components/UI/Button'

export default {
  title: 'Button',
  component: Button,
} as ComponentMeta<typeof Button>

const Template: ComponentStory<typeof Button> = (args) => <Button {...args}>{`I'm a button`}</Button>

export const BasicButton = Template.bind({})
