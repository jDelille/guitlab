import { useEffect, useState } from "react";

let drillsCache: any[] | null = null;

export function useDrills() {
  const [drills, setDrills] = useState<any[]>(drillsCache ?? []);

  useEffect(() => {
    if (drillsCache) return;
    fetch("http://127.0.0.1:8000/drills")
      .then((res) => res.json())
      .then((data) => {
        drillsCache = data;
        setDrills(data);
      });
  }, []);

  return drills;
}
