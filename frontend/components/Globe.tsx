"use client";

import dynamic from "next/dynamic";
import { useMemo, useRef, useState } from "react";
import type { GlobeMethods } from "react-globe.gl";

export type GlobeCoords = {
  lat: number;
  lng: number;
};

type GlobePoint = GlobeCoords & {
  type: "selected" | "hover";
};

interface GlobeProps {
  globeImageUrl?: string;
  selectedCoords?: GlobeCoords | null;
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
  selectedCoords,
  onLocationClick,
  ...props
}: GlobeProps) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [hoverCoords, setHoverCoords] = useState<GlobeCoords | null>(null);

  // Points
  const selectedPoint = useMemo(
    () =>
      selectedCoords ? { ...selectedCoords, type: "selected" as const } : null,
    [selectedCoords],
  );
  const hoverPoint = useMemo(
    () => (hoverCoords ? { ...hoverCoords, type: "hover" as const } : null),
    [hoverCoords],
  );
  const points = useMemo(
    () => [hoverPoint, selectedPoint].filter(Boolean),
    [hoverPoint, selectedPoint],
  );
  return (
    <div
      onMouseMove={(event) => {
        const coords = globeRef.current?.toGlobeCoords(
          event.clientX,
          event.clientY,
        );

        setHoverCoords(coords ?? null);
      }}
      onMouseLeave={() => setHoverCoords(null)}
    >
      <GlobeComponent
        ref={globeRef}
        {...props}
        globeImageUrl={globeImageUrl}
        pointsData={points}
        pointLat="lat"
        pointLng="lng"
        pointColor={(point) =>
          (point as GlobePoint).type === "selected"
            ? "rgba(255, 255, 255, 0.70)"
            : "rgba(255, 255, 255, 0.35)"
        }
        pointAltitude={(point) =>
          (point as GlobePoint).type === "selected" ? 0.05 : 0.002
        }
        pointRadius={(point) =>
          (point as GlobePoint).type === "selected" ? 0.35 : 0.25
        }
        onGlobeClick={(coords, event) => {
          onLocationClick?.(coords);
        }}
        onPointClick={(point) => {
          const { lat, lng } = point as GlobePoint;
          onLocationClick?.({ lat, lng });
        }}
      />
    </div>
  );
}
