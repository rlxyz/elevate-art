import LogRocket from 'logrocket'
import Rollbar from 'rollbar'
import create from 'zustand'

export const rollbar = new Rollbar({
  accessToken: process.env.NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: process.env.NEXT_PUBLIC_APP_ENV,
})

rollbar.configure({
  transform: function (obj) {
    // @ts-expect-error
    obj.sessionURL = LogRocket.sessionURL
  },
})

interface Store {
  rollbar: Rollbar
}

export const useStore = create<Store>(() => {
  return {
    rollbar,
  }
})
