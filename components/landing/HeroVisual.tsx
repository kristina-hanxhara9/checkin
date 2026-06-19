"use client";

import dynamic from "next/dynamic";
import { HeroIllustration } from "./HeroIllustration";

const HeroScene3D = dynamic(() => import("./HeroScene3D").then((m) => m.HeroScene3D), {
  ssr: false,
  loading: () => <HeroIllustration />,
});

/**
 * Picks the right hero visual:
 * - On mobile (<md), the 2D <HeroIllustration> stays — Canvas + WebGL is too
 *   heavy for cheap phones and the 2D version already looks great.
 * - On md and up, the WebGL <HeroScene3D> takes over.
 */
export function HeroVisual() {
  return (
    <>
      <div className="md:hidden">
        <HeroIllustration />
      </div>
      <div className="hidden md:block">
        <HeroScene3D />
      </div>
    </>
  );
}
