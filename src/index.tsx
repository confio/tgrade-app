import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { credentials } from "config/credentials";
import { StrictMode } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

Sentry.init({
  dsn: process.env.NODE_ENV === "production" ? credentials.sentry.dsn : undefined,
  integrations: [new Integrations.BrowserTracing()],
  // Sample rate to determine trace sampling (percentage of traces sent)
  // 0.0 = send no traces 1.0 = send all traces
  tracesSampleRate: 1.0,
});

ReactDOM.render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={"An error has occurred"}>
      <App />
    </Sentry.ErrorBoundary>
  </StrictMode>,
  document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
