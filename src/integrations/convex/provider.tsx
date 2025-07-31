import type { useAuth } from "@clerk/clerk-react";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { ConvexProviderWithClerk } from "convex/react-clerk";

const CONVEX_URL = (import.meta as any).env.VITE_CONVEX_URL;
if (!CONVEX_URL) {
  console.error("missing envar CONVEX_URL");
}
const convexQueryClient = new ConvexQueryClient(CONVEX_URL);

export default function AppConvexProvider({
  children,
  useClerkAuth,
}: {
  children: React.ReactNode;
  useClerkAuth: typeof useAuth;
}) {
  return (
    <ConvexProviderWithClerk
      client={convexQueryClient.convexClient}
      useAuth={useClerkAuth}
    >
      {children}
    </ConvexProviderWithClerk>
  );
}
