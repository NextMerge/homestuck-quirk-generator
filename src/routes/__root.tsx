import { useAuth } from "@clerk/clerk-react";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Header from "../components/Header";
import ClerkProvider from "../integrations/clerk/provider.tsx";
import ConvexProvider from "../integrations/convex/provider.tsx";
import appCss from "../styles.css?url";

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
        title: "TanStack Start Starter",
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
          <Header />

          <div className="mx-auto max-w-[1900px]">
            <Outlet />
          </div>
          <TanStackRouterDevtools />
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
