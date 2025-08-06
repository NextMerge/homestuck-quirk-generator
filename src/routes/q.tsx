import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/q")({
  beforeLoad: async ({ location }) => {
    // Only redirect if this is exactly "/q" with no additional path segments
    if (location.pathname === "/q" || location.pathname === "/q/") {
      throw redirect({ to: "/" });
    }
  },
  component: () => <Outlet />,
});
