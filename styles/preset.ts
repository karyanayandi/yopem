import type { Config } from "tailwindcss"
import animatePlugin from "tailwindcss-animate"

import { stylePlugin } from "./plugin"

export const stylePreset = {
  content: [],
  darkMode: ["class"],
  plugins: [stylePlugin, animatePlugin],
} satisfies Config
