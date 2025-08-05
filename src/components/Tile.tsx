import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type TileProps = {
  children: ReactNode;
  className?: string;
};

export function Tile({ children, className }: TileProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded border-2 border-green-800/40 bg-black/20",
        "before:absolute before:top-0 before:right-0 before:left-0 before:h-6 before:border-b before:border-green-800/30 before:bg-green-900/20",
        "after:absolute after:top-1.5 after:left-2 after:h-2 after:w-2 after:rounded-full after:bg-green-500/60",
        "font-mono shadow-sm pt-8",
        className,
      )}
    >
      <div className="pt-8">{children}</div>
    </div>
  );
}
