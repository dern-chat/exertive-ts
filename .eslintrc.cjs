module.exports = {
    env: { browser: true, es2020: true, node: true },
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    rules: {
        'no-multiple-empty-lines': ['warn', { max: 1, maxEOF: 1 }],
        quotes: ['warn', 'single', { avoidEscape: true }],
        semi: ['warn', 'never']
    }
}
