const webpack = require('webpack');
const path = require('path')
module.exports = {
  "stories": [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/preset-scss",
    "@storybook/addon-essentials"
  ],
  babel: async (options) => {
    return {
      presets: [
        [
          'next/babel',
          {
            'preset-env': {
              targets: 'last 2 versions',
            },
          },
        ],
      ],
      plugins: [
        // 'react-native-reanimated/plugin',
        // ['react-native-web', { commonjs: true }],
        [
          'module-resolver',
          {
            alias: {
              // 'react-native$': 'react-native-web',
              // 'lottie-react-native$': 'react-native-web-lottie',
              components: './components/',
              common: './common/',
              project: './project/',
              mobile: './mobile/',
              // 'react-native-reanimated': path.resolve(
              //   __dirname,
              //   '../node_modules/react-native-reanimated',
              // ),
            },
          },
        ],
      ],
    }

  },
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    config.resolve.modules = [path.resolve(__dirname), 'node_modules']

    config.resolve.alias = {
      ...(config.resolve.alias || {}),      // Transform all direct `react-native` imports to `react-native-web`
      // 'react-native$': 'react-native-web',
      // '@storybook/react-native': '@storybook/react',
      // 'react-native-reanimated': path.resolve(
      //   __dirname,
      //   '../node_modules/react-native-reanimated',
      // ),
    }
    config.resolve.extensions = [ '.web.js', '.web.jsx', '.web.tsx', '.mjs', '.js',  '.jsx', '.ts', '.tsx',   '.cjs']
    // config.module.rules.map((v)=>{
    //   const exclude = v.exclude + ""
    //   if (exclude === "/node_modules/") {
    //     v.exclude = /node_modules\/(?!(react-native-reanimated|react-native-svg|react-native-safe-area-context)\/).*/
    //   }
    //   console.log(v.options)
    // })

    config.plugins.push(new webpack.DefinePlugin({
      __DEV__: true
    }));

    // Return the altered config
    return config;
  },
}
