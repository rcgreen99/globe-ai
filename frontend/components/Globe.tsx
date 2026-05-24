"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import type { GlobeMethods } from "react-globe.gl";

export type GlobeCoords = {
  lat: number;
  lng: number;
};

type GlobePoint = GlobeCoords & {
  type: "selected" | "hover";
};

function isGlobePoint(point: GlobePoint | null): point is GlobePoint {
  return point !== null;
}

interface GlobeProps {
  globeImageUrl?: string;
  selectedCoords?: GlobeCoords | null;
  onLocationClick?: (coords: GlobeCoords) => void;
  width?: number;
  height?: number;
  [key: string]: unknown; // Allow other Globe props
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const resizeFrameRef = useRef<number | null>(null);
  const pendingSizeRef = useRef({ width: 0, height: 0 });
  const [hoverCoords, setHoverCoords] = useState<GlobeCoords | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      pendingSizeRef.current = {
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      };

      if (resizeFrameRef.current !== null) return;

      resizeFrameRef.current = window.requestAnimationFrame(() => {
        setContainerSize(pendingSizeRef.current);
        resizeFrameRef.current = null;
      });
    });

    resizeObserver.observe(container);
    return () => {
      resizeObserver.disconnect();
      if (resizeFrameRef.current !== null) {
        window.cancelAnimationFrame(resizeFrameRef.current);
        resizeFrameRef.current = null;
      }
    };
  }, []);

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
    () => [hoverPoint, selectedPoint].filter(isGlobePoint),
    [hoverPoint, selectedPoint],
  );
  return (
    <div
      ref={containerRef}
      className="h-full w-full bg-black"
      onMouseMove={(event) => {
        const coords = globeRef.current?.toGlobeCoords(
          event.clientX,
          event.clientY,
        );

        setHoverCoords(coords ?? null);
      }}
      onMouseLeave={() => setHoverCoords(null)}
    >
      {containerSize.width > 0 && containerSize.height > 0 && (
        <GlobeComponent
          ref={globeRef}
          {...props}
          width={containerSize.width}
          height={containerSize.height}
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
          onGlobeClick={(coords) => {
            onLocationClick?.(coords);
          }}
          onPointClick={(point) => {
            const { lat, lng } = point as GlobePoint;
            onLocationClick?.({ lat, lng });
          }}
        />
      )}
    </div>
  );
}
