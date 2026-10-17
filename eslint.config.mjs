import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    // Generated shadcn registry (scripts/build-registry.ts).
    "registry/**",
    "public/r/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Package build output.
    "packages/*/dist/**",
  ]),
]);

export default eslintConfig;
