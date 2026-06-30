import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const TOUR_KEY = "guitlab_tour_done";

export function startTour() {
  const driverObj = driver({
    showProgress: true,
    animate: true,
    overlayOpacity: 0.55,
    stagePadding: 8,
    stageRadius: 8,
    popoverClass: "guitlab-tour",
    nextBtnText: "Next →",
    prevBtnText: "← Back",
    doneBtnText: "Let's go",
    onDestroyed: () => {
      localStorage.setItem(TOUR_KEY, "1");
    },
    steps: [
      {
        popover: {
          title: "Welcome to Guitlab",
          description:
            "Visualize scales, explore CAGED shapes, and drill the neck. Here's everything you need to know.",
          side: "top",
          align: "center",
        },
      },
      {
        element: "#tour-fretboard",
        popover: {
          title: "The Fretboard",
          description:
            "Every highlighted dot is a note in your current key and scale. Click any note to hear it.",
          side: "bottom",
          align: "center",
        },
      },
      {
        element: "#tour-key",
        popover: {
          title: "Key",
          description: "Set the root key. All notes and shapes update instantly.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "#tour-scale",
        popover: {
          title: "Scale / Arpeggio",
          description:
            "Switch between major, minor, pentatonic, dom7, and more. The fretboard maps it across all five CAGED positions.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "#tour-overlay",
        popover: {
          title: "Overlay",
          description:
            "Toggle note names, scale degrees, triads, or double stops directly on the fretboard.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "#tour-playback",
        popover: {
          title: "Playback",
          description:
            "Play the scale at any BPM, fire up the metronome, or load a backing track to jam over.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "#tour-chords",
        popover: {
          title: "CAGED Shapes",
          description:
            "These are the five chord shapes that cover the whole neck. Click one to see where it sits. Click again to layer multiple shapes.",
          side: "top",
          align: "start",
        },
      },
      {
        element: "#tour-lab",
        popover: {
          title: "The Lab",
          description:
            "Ready to drill it in? The Lab walks you through the CAGED system shape by shape with instant feedback.",
          side: "bottom",
          align: "start",
        },
      },
    ],
  });

  driverObj.drive();
}

export function maybeStartTour() {
  if (window.innerWidth < 768) return;
  if (!localStorage.getItem(TOUR_KEY)) {
    setTimeout(startTour, 600);
  }
}

export function resetTour() {
  localStorage.removeItem(TOUR_KEY);
}
