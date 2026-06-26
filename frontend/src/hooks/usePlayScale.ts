import { useEffect } from "react";
import { playScale, playDoubleStops, playTriads } from "../audio/playScale";
import { getShapesForKey, type ShapeName } from "../constants/CagedChords";
import type { Scales } from "../types/Scales";
import { lickToPlayNotes, MIDI_TUNING } from "../audio/utils";
import { getLicksForShape } from "../constants/licks";
import { getDoubleStopsForKey } from "../constants/doubleStops";
import { getTriadsForKey, type CagedShape } from "../constants/triads";
import { useSettings } from "../context/SettingsContext";

type ActivePositions = { string: number; fret: number }[] | null;

const ALL_SHAPES: ShapeName[] = ["C", "A", "G", "E", "D"];

interface UsePlayScaleArgs {
  cagedChord: ShapeName;
  selectedShapes: Set<ShapeName>;
  selectedLickId: string | null;
  setActivePositions: (positions: ActivePositions) => void;
}

export function usePlayScale({
  cagedChord,
  selectedShapes,
  selectedLickId,
  setActivePositions,
}: UsePlayScaleArgs) {
  const { settings, setSettings } = useSettings();

  useEffect(() => {
    if (!settings.playScale) return;

    const onComplete = () =>
      setSettings((s: any) => ({ ...s, playScale: false }));
    let cancel: (() => void) | undefined;
    let cleaned = false;

    if (settings.showDoubleStops) {
      const pairs = [...getDoubleStopsForKey(settings.key)].sort((a, b) => {
        const minDiff = Math.min(...a.frets) - Math.min(...b.frets);
        return minDiff !== 0
          ? minDiff
          : Math.max(...a.frets) - Math.max(...b.frets);
      });
      playDoubleStops(
        pairs,
        settings.playScaleBpm,
        setActivePositions,
        onComplete,
      ).then((stop) => {
        if (cleaned) stop();
        else cancel = stop;
      });
    } else if (settings.showTriads) {
      const triads = [
        ...getTriadsForKey(settings.key, cagedChord as CagedShape),
      ].sort((a, b) => Math.min(...a.frets) - Math.min(...b.frets));
      playTriads(
        triads,
        settings.playScaleBpm,
        setActivePositions,
        onComplete,
      ).then((stop) => {
        if (cleaned) stop();
        else cancel = stop;
      });
    } else {
      const activeLick = selectedLickId
        ? getLicksForShape(
            cagedChord,
            settings.scale as Scales,
            settings.key,
          ).find((l) => l.id === selectedLickId)
        : null;

      if (activeLick) {
        playScale(
          lickToPlayNotes(activeLick.notes),
          settings.playScaleBpm,
          settings.playScaleDirection,
          (pos) => setActivePositions(pos ? [pos] : null),
          onComplete,
        ).then((stop) => {
          if (cleaned) stop();
          else cancel = stop;
        });
      } else {
        const shapesToPlay = settings.showAllCagedScales
          ? ALL_SHAPES
          : ALL_SHAPES.filter((s) => selectedShapes.has(s));

        const notes: { midi: number; string: number; fret: number }[] = [];

        const toPlayNotes = (arr: any[]) =>
          arr
            .filter(
              (n) => n.fret !== null && n.fret >= 0 && !n.isOctaveExtension,
            )
            .map((n) => ({
              midi: MIDI_TUNING[n.string] + n.fret!,
              string: n.string,
              fret: n.fret!,
            }))
            .sort((a, b) =>
              a.string !== b.string ? b.string - a.string : a.fret - b.fret,
            );

        shapesToPlay.forEach((shapeName) => {
          const scaleData = getShapesForKey(settings.key)[shapeName][
            settings.scale as Scales
          ];
          const primaryRoot = scaleData.find(
            (n) => n.isRoot && !n.isOctaveExtension,
          );
          if (!primaryRoot || primaryRoot.fret === null) return;

          const shiftedData =
            primaryRoot.fret < 0
              ? scaleData.map((n) => ({
                  ...n,
                  fret: n.fret !== null ? n.fret + 12 : null,
                }))
              : scaleData;
          notes.push(...toPlayNotes(shiftedData));
        });

        playScale(
          notes,
          settings.playScaleBpm,
          settings.playScaleDirection,
          (pos) => setActivePositions(pos ? [pos] : null),
          onComplete,
        ).then((stop) => {
          if (cleaned) stop();
          else cancel = stop;
        });
      }
    }

    return () => {
      cleaned = true;
      cancel?.();
    };
  }, [
    settings.playScale,
    settings.playScaleBpm,
    settings.showDoubleStops,
    settings.showTriads,
    settings.showAllCagedScales,
    settings.key,
    settings.scale,
    cagedChord,
    selectedShapes,
    selectedLickId,
  ]);
}
