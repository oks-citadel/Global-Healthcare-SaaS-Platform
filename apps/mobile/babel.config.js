module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Required for expo-router
      'expo-router/babel',
      // For async/await support
      '@babel/plugin-transform-runtime',
      // For optional chaining and nullish coalescing
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-nullish-coalescing-operator',
    ],
  };
};
