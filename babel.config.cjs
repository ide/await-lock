module.exports = function(api) {
  api.cache(true);
  return {
    plugins: [
      '@babel/plugin-transform-modules-commonjs',
      '@babel/plugin-proposal-class-properties',
    ],
    presets: ['@babel/preset-typescript'],
  };
};
