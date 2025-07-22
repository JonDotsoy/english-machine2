import { persistentAtom } from "@nanostores/persistent";

// Animation enabled: boolean
export const animationStore = persistentAtom<boolean>(
  "settings:animation",
  true,
  {
    encode: (v) => (v ? "1" : "0"),
    decode: (v) => v === "1",
  },
);

// Exam mode enabled: boolean
export const examModeStore = persistentAtom<boolean>(
  "settings:examMode",
  false,
  {
    encode: (v) => (v ? "1" : "0"),
    decode: (v) => v === "1",
  },
);
