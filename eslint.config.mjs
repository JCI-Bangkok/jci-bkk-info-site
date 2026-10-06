import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "ds-bundle/**",
      ".ds-sync/**",
      "scripts/**",
      "out/**",
    ],
  },
  ...nextVitals,
  ...nextTypescript,
];

export default config;
