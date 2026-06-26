import { createContext, useContext, useState } from "react";

export interface BackingChord {
  offset: number;
  quality: "major" | "minor";
}

interface PlaybackContextValue {
  currentBackingChord: BackingChord | null;
  setCurrentBackingChord: (chord: BackingChord | null) => void;
}

const PlaybackContext = createContext<PlaybackContextValue>({
  currentBackingChord: null,
  setCurrentBackingChord: () => {},
});

export const usePlayback = () => useContext(PlaybackContext);

export const PlaybackProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentBackingChord, setCurrentBackingChord] = useState<BackingChord | null>(null);
  return (
    <PlaybackContext.Provider value={{ currentBackingChord, setCurrentBackingChord }}>
      {children}
    </PlaybackContext.Provider>
  );
};
