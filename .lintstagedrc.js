module.exports = {
  '*.{js,jsx,ts,tsx}': (files) => {
    // Exclude config files
    const filtered = files.filter(
      (file) =>
        !file.includes('.config.') &&
        !file.includes('.eslintrc') &&
        !file.includes('.lintstagedrc')
    )
    if (filtered.length === 0) return []
    return [
      `eslint --fix --max-warnings 0 ${filtered.join(' ')}`,
      `prettier --write ${filtered.join(' ')}`,
    ]
  },
  '*.{json,css,md}': ['prettier --write'],
}
