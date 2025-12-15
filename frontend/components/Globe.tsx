"use client";

import dynamic from "next/dynamic";

const GlobeComponent = dynamic(() => import("react-globe.gl"), {
  ssr: false,
});

interface GlobeProps {
  globeImageUrl?: string;
  width?: number;
  height?: number;
  [key: string]: any; // Allow other Globe props
}

function onGlobeClick(event: any) {
  console.log(event);
}

export default function Globe({ globeImageUrl, ...props }: GlobeProps) {
  return (
    <GlobeComponent
      globeImageUrl={globeImageUrl}
      {...props}
      onGlobeClick={onGlobeClick}
    />
  );
}
