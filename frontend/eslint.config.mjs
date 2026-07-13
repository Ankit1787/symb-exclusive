
import js from "@eslint/js";
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier, { rules } from 'eslint-config-prettier';

export default [
    {
        ignores: [
            ".nuxt/**",
            ".output/**",
            "dist/**",
            "node_modules/**"
        ]
    }
    ,
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            }
        },
        rules: {
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_"
                }
            ],
            "no-empty": [
                "warn",
                {
                    allowEmptyCatch: true
                }
            ]
        }
    },

    eslintConfigPrettier
]
