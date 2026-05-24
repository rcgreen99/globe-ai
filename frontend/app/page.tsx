"use client";

import { useState } from "react";
import Globe, { GlobeCoords } from "@/components/Globe";
import ChatSidePanel from "@/components/ChatSidePanel";
import GlobeTextureMenu, {
  GlobeTextureOption,
} from "@/components/GlobeTextureMenu";

const globeTextures: GlobeTextureOption[] = [
  {
    id: "day",
    label: "Day",
    url: "/earth-day.jpg",
  },
  {
    id: "night",
    label: "Night",
    url: "/earth-night.jpg",
  },
];

export default function App() {
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<GlobeCoords | null>(
    null,
  );
  const [selectedTextureId, setSelectedTextureId] = useState(
    globeTextures[0].id,
  );

  const selectedTexture =
    globeTextures.find((texture) => texture.id === selectedTextureId) ??
    globeTextures[0];

  return (
    <div className="flex h-screen overflow-hidden bg-black">
      <main className="relative min-w-0 flex-1 overflow-hidden bg-black">
        <Globe
          globeImageUrl={selectedTexture.url}
          selectedCoords={selectedCoords}
          onLocationClick={(coords) => {
            setSelectedCoords(coords);
            setIsChatExpanded(true);
          }}
        />

        <GlobeTextureMenu
          textures={globeTextures}
          selectedTextureId={selectedTextureId}
          onTextureSelect={setSelectedTextureId}
        />
      </main>

      <ChatSidePanel
        coords={selectedCoords}
        isExpanded={isChatExpanded}
        onToggle={() => setIsChatExpanded((isExpanded) => !isExpanded)}
      />
    </div>
  );
}
