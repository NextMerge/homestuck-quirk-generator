import { useAuth } from "@clerk/clerk-react";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Header from "../components/Header";
import { Toaster } from "../components/ui/sonner";
import ClerkProvider from "../integrations/clerk/provider.tsx";
import ConvexProvider from "../integrations/convex/provider.tsx";
import appCss from "../styles.css?url";
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://794d8424b96ef74942f929e931f9e405@o4510019787554816.ingest.us.sentry.io/4510019815997440",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Homestuck Quirks",
      },
      {
        name: "description",
        content:
          "A site that allows you to explore and build typing quirks of Homestuck characters.",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  component: () => (
    <RootDocument>
      <ClerkProvider>
        <ConvexProvider useClerkAuth={useAuth}>
          <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1">
              <div className="mx-auto max-w-container px-container">
                <Outlet />
              </div>
            </main>

            <footer className="bg-gray-900 border-t border-gray-800 py-4">
              <div className="mx-auto max-w-container px-container">
                <div className="text-center text-gray-400 text-sm">
                  Made with ❤ by someone •{" "}
                  <a
                    href="https://github.com/NextMerge/homestuck-quirk-generator"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors underline"
                  >
                    Source code
                  </a>
                </div>
              </div>
            </footer>
          </div>
          <TanStackRouterDevtools />
          <Toaster />
        </ConvexProvider>
      </ClerkProvider>
    </RootDocument>
  ),
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
