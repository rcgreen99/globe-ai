"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";

export type GlobeCoords = {
  lat: number;
  lng: number;
};
interface GlobeProps {
  globeImageUrl?: string;
  onLocationClick?: (coords: GlobeCoords) => void;
  width?: number;
  height?: number;
  [key: string]: any; // Allow other Globe props
}

const GlobeComponent = dynamic(() => import("react-globe.gl"), {
  ssr: false,
});

export default function Globe({
  globeImageUrl,
  onLocationClick,
  ...props
}: GlobeProps) {
  const globeRef = useRef<GlobeMethods>();
  const [hoverCoords, setHoverCoords] = useState<GlobeCoords | null>(null);

  return (
    <div
      onMouseMove={(event) => {
        const coords = globeRef.current?.toGlobeCoords(
          event.clientX,
          event.clientY,
        );

        setHoverCoords(coords);
      }}
      onMouseLeave={() => setHoverCoords(null)}
    >
      <GlobeComponent
        ref={globeRef}
        {...props}
        globeImageUrl={globeImageUrl}
        pointsData={hoverCoords ? [hoverCoords] : []}
        pointLat="lat"
        pointLng="lng"
        pointColor={() => "#d3d3d3"}
        pointAltitude={0.002}
        pointRadius={0.25}
        onGlobeClick={(coords, event) => {
          onLocationClick?.(coords);
        }}
        onPointClick={(point) => {
          onLocationClick?.(point as GlobeCoords);
        }}
      />
    </div>
  );
}
