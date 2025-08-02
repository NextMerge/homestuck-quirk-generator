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
        "rounded-xl border border-white/20 bg-white/10 shadow-2xl shadow-black/20 backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
