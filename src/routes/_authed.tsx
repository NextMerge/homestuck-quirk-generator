import { SignInButton } from "@clerk/clerk-react";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";

export const Route = createFileRoute("/_authed")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <>
      <Unauthenticated>
        <SignInButton />
      </Unauthenticated>
      <Authenticated>
        <Outlet />
      </Authenticated>
    </>
  );
}
