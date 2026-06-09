import { Note } from "tonal";

function getNoteFromDegree(root: string, degree: string | number | null) {
  if (degree == null) return null;

  if (degree === "R") return root;

  const map: Record<string, string> = {
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    b3: "m3",
    b7: "m7",
  };

  const interval = map[String(degree)];
  if (!interval) return null;

  return Note.transpose(root, interval);
}

export default getNoteFromDegree;