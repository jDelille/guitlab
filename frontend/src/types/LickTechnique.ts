export interface LickTechnique {
  technique: "bend" | "slide" | "hammer-on" | "pull-off";

  bend?: {
    amount: number;
    duration: number;
  };

  slide?: {
    toFret: number;
    duration: number;
  };

  hammerOn?: {
    toFret: number;
    duration: number;
  };

  pullOff?: {
    toFret: number;
    duration: number;
  };
}