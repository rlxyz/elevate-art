import Rollbar from "rollbar";

export const rollbar = new Rollbar({
  accessToken: process.env.NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: process.env.NEXT_PUBLIC_APP_ENV,
});
