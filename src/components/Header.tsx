import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Link } from "@tanstack/react-router";
import { Authenticated, Unauthenticated } from "convex/react";

export default function Header() {
  return (
    <div className="bg-white">
      <header className="mx-auto flex max-w-[1600px] justify-between gap-2 p-2 text-black">
        <nav className="flex flex-row">
          <div className="px-2 font-bold">
            <Link to="/">Home</Link>
          </div>

          <div className="px-2 font-bold">
            <Link to="/demo/start/server-funcs">Start - Server Functions</Link>
          </div>

          <div className="px-2 font-bold">
            <Link to="/demo/start/api-request">Start - API Request</Link>
          </div>

          <div className="px-2 font-bold">
            <Link to="/demo/clerk">Clerk</Link>
          </div>

          <div className="px-2 font-bold">
            <Link to="/demo/convex">Convex</Link>
          </div>

          <div className="px-2 font-bold">
            <Link to="/demo/form/simple">Simple Form</Link>
          </div>

          <div className="px-2 font-bold">
            <Link to="/demo/form/address">Address Form</Link>
          </div>
        </nav>

        <div>
          <Authenticated>
            <UserButton />
          </Authenticated>
          <Unauthenticated>
            <SignInButton />
          </Unauthenticated>
        </div>
      </header>
    </div>
  );
}
