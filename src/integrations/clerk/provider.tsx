import { env } from "@/env";
import { ClerkProvider } from "@clerk/clerk-react";
import { dark, neobrutalism } from "@clerk/themes";

const PUBLISHABLE_KEY = env.VITE_CLERK_PUBLISHABLE_KEY;

export default function AppClerkProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        baseTheme: [dark, neobrutalism],
      }}
    >
      {children}
    </ClerkProvider>
  );
}
