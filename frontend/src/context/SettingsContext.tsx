import { createContext, useContext, useState } from "react";
import { DEFAULT_KEY_KEY, DEFAULT_SCALE_KEY } from "../constants/preferences";

export interface Settings {
  key: string;
  scale: string;
  tuning: string;
  frets: number;
  showNotes: boolean;
  showDegrees: boolean;
  showTriads: boolean;
  showAllCagedScales: boolean;
  showDoubleStops: boolean;
  showScaleWithDoubleStops: boolean;
  flipped: boolean;
  flipFretboard: boolean;
  flipStrings: boolean;
  playScale: boolean;
  playScaleBpm: number;
  playScaleDirection: string;
}

const DEFAULT_SETTINGS: Settings = {
  key: localStorage.getItem(DEFAULT_KEY_KEY) ?? "C",
  scale: localStorage.getItem(DEFAULT_SCALE_KEY) ?? "majorPentatonic",
  tuning: "standard",
  frets: 15,
  showNotes: false,
  showDegrees: true,
  showTriads: false,
  showAllCagedScales: false,
  showDoubleStops: false,
  showScaleWithDoubleStops: false,
  flipped: false,
  flipFretboard: false,
  flipStrings: false,
  playScale: false,
  playScaleBpm: 120,
  playScaleDirection: "asc",
};

interface SettingsContextValue {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULT_SETTINGS,
  setSettings: () => {},
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
