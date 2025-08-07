import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { Link, useLocation } from "@tanstack/react-router";
import { Authenticated, Unauthenticated } from "convex/react";

export default function Header() {
  const location = useLocation();
  const isIndexPage = location.pathname === "/";
  const { user } = useUser();

  return (
    <div className="bg-gray-900 border-b border-gray-800">
      <header className="mx-auto flex max-w-[1600px] justify-between items-center gap-4 px-4 py-4 text-white">
        <nav className="flex flex-row items-center gap-6">
          <div className="font-bold text-lg">
            <Link to="/" className="hover:text-gray-300 transition-colors">
              Homestuck Quirks
            </Link>
          </div>

          <Authenticated>
            {user?.username && (
              <div className="font-medium">
                <Link
                  to={"/q/{$user}/{-$collection}"}
                  params={{
                    user: user.username,
                    collection: undefined,
                  }}
                  className="hover:text-gray-300 transition-colors"
                >
                  My Collections
                </Link>
              </div>
            )}
          </Authenticated>
        </nav>

        {/* Index page notice */}
        {isIndexPage && (
          <div className="hidden md:block text-center flex-1 mx-8">
            <Unauthenticated>
              <p className="text-gray-300 text-sm">
                You can now build your own quirks! Better a decade late than
                never! Sign in to start.
              </p>
            </Unauthenticated>
          </div>
        )}

        <div className="flex items-center">
          <Authenticated>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                  userButtonPopoverCard: "bg-gray-800 border-gray-700",
                  userButtonPopoverActionButton:
                    "text-gray-300 hover:bg-gray-700",
                },
              }}
            />
          </Authenticated>
          <Unauthenticated>
            <SignInButton>
              <button
                type="button"
                className="hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Sign In
              </button>
            </SignInButton>
          </Unauthenticated>
        </div>
      </header>
    </div>
  );
}
