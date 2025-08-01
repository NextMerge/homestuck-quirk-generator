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
        "rounded-xl border border-white/10 bg-white/5 shadow-2xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
