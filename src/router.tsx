import * as Sentry from "@sentry/react";
import { createRouter as createTanstackRouter } from "@tanstack/react-router";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const getRouter = () => {
  const router = createTanstackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  Sentry.init({
    dsn: "https://794d8424b96ef74942f929e931f9e405@o4510019787554816.ingest.us.sentry.io/4510019815997440",
    // Adds request headers and IP for users, for more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/react/
    sendDefaultPii: true,
    integrations: [Sentry.tanstackRouterBrowserTracingIntegration(router)],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for tracing.
    // We recommend adjusting this value in production.
    // Learn more at https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
  });

  return router;
};

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
