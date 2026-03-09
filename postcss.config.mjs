const config = {
  plugins: [
    '@tailwindcss/postcss',
    [
      'postcss-pxtorem',
      {
        rootValue: 16,
        unitPrecision: 5,
        propList: [
          '*',
          '!border-radius',
          '!border-top-left-radius',
          '!border-top-right-radius',
          '!border-bottom-right-radius',
          '!border-bottom-left-radius'
        ],
        selectorBlackList: [],
        replace: true,
        mediaQuery: false,
        minPixelValue: 0,
        exclude: /node_modules/i
      }
    ]
  ]
}

export default config
