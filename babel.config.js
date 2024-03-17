// babel.config.js
// module.exports = {
//     presets: [
//       '@babel/preset-env',
//       '@babel/preset-react',
//       '@babel/preset-flow',
//     ],
//     plugins: [
//       'babel-plugin-styled-components',
//       '@babel/plugin-proposal-class-properties',
//     ]
//   }

const presets = [
    [
      "@babel/preset-env",
      {
        targets: {
          edge: "17",
          firefox: "60",
          chrome: "67",
          safari: "11.1",
        },
        useBuiltIns: "usage",
        corejs: "3.6.4",
      },
    ],
  ];
  
  module.exports = { presets };