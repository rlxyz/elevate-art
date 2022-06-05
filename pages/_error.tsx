import { rollbar } from '@utils/rollbar'
import type { NextPageContext } from 'next'
import NextErrorComponent from 'next/error'

type ErrorPageProps = {
  err?: Error
  hasGetInitialPropsRun?: boolean
  statusCode: number
}

function CustomError({ statusCode, hasGetInitialPropsRun, err }: ErrorPageProps) {
  if (!hasGetInitialPropsRun && err) {
    rollbar.error(err)
  }

  return <NextErrorComponent statusCode={statusCode} />
}

CustomError.getInitialProps = async (props: NextPageContext) => {
  const { err, asPath } = props

  const errorInitialProps = await NextErrorComponent.getInitialProps(props)

  // @ts-expect-error this is inject the method directly
  errorInitialProps.hasGetInitialPropsRun = true

  if (err) {
    rollbar.error(err)

    return errorInitialProps
  }

  rollbar.error(new Error(`_error.js getInitialProps missing data at path: ${asPath}`))

  return errorInitialProps
}

export default CustomError
