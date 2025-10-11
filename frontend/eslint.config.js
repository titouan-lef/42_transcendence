import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import tsimport from "eslint-plugin-import";

export default [
	{
		files: ["src/**/*.ts"],
		languageOptions: {
			parser: tsparser,
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module",
				project: "./tsconfig.json",
			},
		},
		plugins: {
			"@typescript-eslint": tseslint,
			"import": tsimport,
		},
		rules: {
			// --- General format ---
			"indent": ["error", "tab", { "SwitchCase": 1 }],
			"no-mixed-spaces-and-tabs": ["error", "smart-tabs"],

			// --- Naming conventions ---
			"@typescript-eslint/naming-convention": [ "error", {
				selector: ["class", "interface", "typeAlias", "enum", "typeParameter"],
				format: ["PascalCase"],
				leadingUnderscore: "forbid",
				trailingUnderscore: "forbid",
			},
			{
				selector: ["variable", "parameter", "function", "method", "property", "parameterProperty", "import", "accessor"],
				format: ["camelCase"],
				leadingUnderscore: "forbid",
				trailingUnderscore: "forbid",
			},
			{
				selector: "property",
				modifiers: ["requiresQuotes"],
				format: null
			},
			{
				selector: ["objectLiteralProperty", "typeProperty"],
				format: null
			},
			{
				selector: "property",
				modifiers: ["static", "readonly"],
				format: ["UPPER_CASE"],
				leadingUnderscore: "forbid",
				trailingUnderscore: "forbid"
			},
			{
				selector: ["variable"],
				modifiers: ["const", "global"],
				format: ["UPPER_CASE"],
				leadingUnderscore: "forbid",
				trailingUnderscore: "forbid",
			},
			{
				selector: "enumMember",
				format: ["UPPER_CASE"],
				leadingUnderscore: "forbid",
				trailingUnderscore: "forbid",
			}],

			// --- Class & instantiation rules ---
			"new-parens": "error", // Enforce parentheses on all constructor calls
			"no-new-wrappers": "error", // Enforce use of primitive literals
			"no-array-constructor": "error",

			// --- Variable declaration rules ---
			"no-var": "error", //  Always use `const` or `let` to declare variables
			"prefer-const": "error",

			// --- Exception handling ---
			"no-throw-literal": "error",

			// --- Code style & braces ---
			"curly": ["error", "multi-line"],
			"brace-style": ["error", "1tbs", { "allowSingleLine": false }],
			"semi": ["error", "always"],

			// --- Switch cases ---
			"default-case": ["error", { "commentPattern": "^no default$" }],
			"no-fallthrough": ["error", { "allowEmptyCase": true }],

			// --- Equality ---
			"eqeqeq": ["error", "smart"],

			// --- Function style ---
			"func-style": ["error", "declaration", { "allowArrowFunctions": false }],
			"prefer-arrow-callback": ["error", { "allowNamedFunctions": false }],
			"arrow-body-style": ["error", "as-needed"],

			// --- TypeScript strictness ---
			"@typescript-eslint/consistent-type-assertions": [ "error", { "assertionStyle": "never" }],
			"@typescript-eslint/no-non-null-assertion": "error",

			// --- Enums ---
			"no-restricted-syntax": ["error", {
					selector: "TSEnumDeclaration[const=true]",
					message: "Avoid using const enums.",
				},
			],

			// --- Source Organization ---
			"@typescript-eslint/no-namespace": "error",
			"@typescript-eslint/no-require-imports": "error",

			// --- Imports / Exports ---
			"import/no-default-export": "error",

			// --- Type system ---
			"@typescript-eslint/no-inferrable-types": "error",
			"@typescript-eslint/explicit-function-return-type": "error",
			"@typescript-eslint/no-explicit-any": "error",
			"@typescript-eslint/consistent-type-definitions": ["error", "interface"],
			"@typescript-eslint/array-type": ["error", {
					default: "array-simple",
					readonly: "array-simple"
				}
			]
		}
	}
];
