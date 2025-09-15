import * as Sentry from "@sentry/react";
import { createRouter as createTanstackRouter } from "@tanstack/react-router";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const createRouter = () => {
  const router = createTanstackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  Sentry.init({
    dsn: "https://794d8424b96ef74942f929e931f9e405@o4510019787554816.ingest.us.sentry.io/4510019815997440",
    integrations: [Sentry.tanstackRouterBrowserTracingIntegration(router)],
    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: true,
  });

  return router;
};

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
