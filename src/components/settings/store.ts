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
