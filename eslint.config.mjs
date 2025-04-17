import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable warnings for `any` type
      "@typescript-eslint/no-explicit-any": "off",
      
      // Disable warnings for unused variables
      "no-unused-vars": "off", // For JavaScript
      "@typescript-eslint/no-unused-vars": "off", // For TypeScript
    },
  },
];

export default eslintConfig;
