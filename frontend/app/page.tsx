"use client";

import { useState } from "react";
import Globe, { GlobeCoords } from "@/components/Globe";
import ChatPopUp from "@/components/ChatPopUp";

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<GlobeCoords | null>(
    null,
  );

  return (
    <div className="App">
      <Globe
        globeImageUrl="https://raw.githubusercontent.com/chrisrzhou/react-globe/main/textures/globe.jpg"
        selectedCoords={selectedCoords}
        onLocationClick={(coords) => {
          setSelectedCoords(coords);
          setIsChatOpen(true);
        }}
      />

      {isChatOpen && (
        <ChatPopUp
          coords={selectedCoords}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
}
