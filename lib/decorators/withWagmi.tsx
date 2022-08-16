import { makeDecorator } from '@storybook/addons'

export const withWagmi = makeDecorator({
  name: 'withWagmi',
  parameterName: '',
  wrapper: (getStory, context) => {
    return getStory(context)
  },
})
