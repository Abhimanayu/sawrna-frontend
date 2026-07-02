"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function LoadingCurtain() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const id = window.setTimeout(() => setShow(false), 420);
    return () => window.clearTimeout(id);
  }, []);

  return (
    show && (
      <div
        className="sawrna-curtain pointer-events-none fixed inset-0 z-[100] grid place-items-center bg-emerald text-blush"
        style={{ opacity: 0, visibility: "hidden" }}
      >
        <div className="sawrna-curtain-logo text-center">
          <Image
            src="/brand/sawrna-logo-header.png"
            alt="SAWRNA Premium Apparel"
            width={1020}
            height={368}
            className="mx-auto h-auto w-64 object-contain sm:w-80"
            priority
          />
        </div>
      </div>
    )
  );
}
