import { useStore } from '@hooks/useStore'
import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props)

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    const rollbar = useStore.getState().rollbar
    rollbar.error(error)
  }

  render() {
    // @ts-ignore
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h2>Oops, there is an error!</h2>
          <button type="button" onClick={() => this.setState({ hasError: false })}>
            Try again?
          </button>
        </div>
      )
    }

    // @ts-ignore
    return this.props.children
  }
}

export default ErrorBoundary
