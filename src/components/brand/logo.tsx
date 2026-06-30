import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  compact = false,
  surface = "light",
}: {
  className?: string;
  compact?: boolean;
  surface?: "light" | "dark";
}) {
  return (
    <Link href="/" className={cn("group inline-flex items-center", className)} aria-label="SAWRNA home">
      <span
        className={cn(
          "relative grid shrink-0 place-items-center overflow-visible",
          compact ? "h-11 w-11" : "h-14 w-[156px] sm:h-[70px] sm:w-[196px] lg:h-[84px] lg:w-[236px]",
        )}
      >
        {compact ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={surface === "dark" ? "/brand/sawrna-iconmark-header.png" : "/brand/sawrna-iconmark-emerald.png"}
            alt="SAWRNA iconmark"
            className="block"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={surface === "dark" ? "/brand/sawrna-logo-header.png" : "/brand/sawrna-logo-emerald.png"}
            alt="SAWRNA Premium Apparel"
            className="block"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        )}
      </span>
    </Link>
  );
}
