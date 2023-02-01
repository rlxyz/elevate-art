export const createInputStringValidation = ({ maxLength = 20, minLength = 3 }: { maxLength?: number; minLength?: number }) => ({
  required: {
    value: true,
    message: 'This field is required',
  },
  maxLength: {
    value: maxLength,
    message: `Must be less than ${maxLength} characters long`,
  },
  minLength: {
    value: minLength,
    message: `Must be more than ${minLength} characters long`,
  },
  pattern: {
    value: /^[-/a-z0-9 ]+$/gi,
    message: 'Only letters, numbers, spaces, dashes and slashes are allowed',
  },
})

export const createInputNumberValidation = ({ max, min }: { max?: number; min?: number }) => ({
  required: {
    value: true,
    message: 'This field is required',
  },
  max: {
    value: max,
    message: `Must be less than ${max}`,
  },
  min: {
    value: min,
    message: `Must be more than ${min}`,
  },
  pattern: {
    value: /^[0-9]+$/gi,
    message: 'Only numbers are allowed',
  },
})
