"use client";

export type GlobeTextureOption = {
  id: string;
  label: string;
  url: string;
};

type GlobeTextureMenuProps = {
  textures: GlobeTextureOption[];
  selectedTextureId: string;
  onTextureSelect: (textureId: string) => void;
};

export default function GlobeTextureMenu({
  textures,
  selectedTextureId,
  onTextureSelect,
}: GlobeTextureMenuProps) {
  return (
    <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-xl border border-white/10 bg-black/70 p-1 shadow-2xl backdrop-blur">
      <div className="flex gap-1">
        {textures.map((texture) => {
          const isSelected = texture.id === selectedTextureId;

          return (
            <button
              key={texture.id}
              type="button"
              onClick={() => onTextureSelect(texture.id)}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                isSelected
                  ? "bg-white text-black"
                  : "text-neutral-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {texture.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
