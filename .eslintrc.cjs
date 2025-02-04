require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
    root: true,
    env: {
        browser: true,
        es2022: true,
        node: true,
    },
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    extends: [
        // Base ESLint recommended rules
        'eslint:recommended',
        // TypeScript recommended rules
        'plugin:@typescript-eslint/recommended',
        // Vue 3 recommended rules
        'plugin:vue/vue3-recommended',
        // Enables eslint-plugin-prettier and eslint-config-prettier
        // This will display Prettier errors as ESLint errors.
        // Make sure this is always the last configuration in the extends array.
        'plugin:prettier/recommended',
    ],
    rules: {
        // Example override (optional):
        // "vue/multi-word-component-names": "off",
        // "vue/no-v-html": "off",
        // "semi": ["error", "never"]
    },
};