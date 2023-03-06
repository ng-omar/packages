module.exports = {
  root: true,
  plugins: ['@nrwl/nx'],
  extends: ['@js-omar/eslint-config/.eslintrc.base.js'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      rules: {
        '@nrwl/nx/enforce-module-boundaries': [
          'error',
          {
            enforceBuildableLibDependency: true,
            allow: [],
            depConstraints: [
              { sourceTag: '*', onlyDependOnLibsWithTags: ['*'] },
            ],
          },
        ],
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'plugin:@nrwl/nx/typescript',
        '@js-omar/eslint-config/.eslintrc.typescript.js',
      ],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.*.json', './{apps,libs}/*/*/tsconfig.*.json'],
      },
    },
    {
      files: ['*.js', '*.jsx'],
      extends: [
        'plugin:@nrwl/nx/javascript',
        '@js-omar/eslint-config/.eslintrc.javascript.js',
      ],
    },
  ],
  ignorePatterns: ['node_modules', 'tmp', 'android', 'ios'],
};
