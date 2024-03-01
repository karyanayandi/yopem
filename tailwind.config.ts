import type { Config } from "tailwindcss"

import { stylePreset } from "./styles/preset"

/** @type {import('tailwindcss').Config} */

export default {
  darkMode: ["class"],
  content: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  presets: [stylePreset],
} satisfies Config
