module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:prettier/recommended",
        "plugin:@typescript-eslint/recommended",
    ],
    settings: {
        react: {
            version: "detect",
        },
        "import/resolver": {
            node: {
                extensions: [".js", ".cjs", ".jsx", ".ts", ".tsx"],
                moduleDirectory: ["src", "node_modules"],
            },
        },
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
    },
    plugins: ["prettier", "react-hooks", "@typescript-eslint"],
    rules: {
        "react-hooks/rules-of-hooks": "error",
        "prettier/prettier": "warn",
        "@typescript-eslint/no-unused-vars": "warn",
        "react-hooks/exhaustive-deps": "warn",
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",
        "no-unused-vars": "off",
        "@typescript-eslint/no-explicit-any": "off",
    },
    globals: {
        JSX: true,
    },
};
