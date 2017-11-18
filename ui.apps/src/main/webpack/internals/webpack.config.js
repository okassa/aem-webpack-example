/**
 * Basic webpack configuration including Babel loader for preset 'latest'.
 *
 * Configuration for Webpack 2, see https://webpack.js.org/configuration/
 */

const webpack = require('webpack');
const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCSS = new ExtractTextPlugin('[name].bundle.css');
const NODE_MODULES = path.join(__dirname, '../node_modules');

const libraryName = 'Project_Component_Library'; // This string must represent a valid JavaScript variable name (e.g., don't start with a number, and don't use spaces)
const outputPath = path.resolve(__dirname, '../../content/jcr_root/apps/__appsFolderName__/clientlibs/webpack.bundles');

const IS_PROD = (process.env.NODE_ENV === 'production');

/*
 * Here we can add as many entry files as we want. One entry results in one output file.
 * <id>: Defines how the target file is named, e.g. 'main' results in 'main.bundle.js'.
 * <path>: Defines the path to an entry file. Entry files can use require.context()
 * to search a directory and include multiple files matching a pattern.
 */
const entryFiles = [{
  id: 'components',
  path: path.resolve(__dirname, '../bundles/components.js')
}];

// Create separate entry points
const entries = {};
entryFiles.forEach(function (fileData) {
  entries[fileData.id] = fileData.path;
});

module.exports = {
  entry: entries,
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader'
      }, {
        loader: 'eslint-loader',
        options: {
          configFile: path.resolve(__dirname, './eslint.config.js'),
          // This option makes ESLint automatically fix minor issues
          fix: !IS_PROD,
        },
      }],
    }, {
      // The "?" allows you use both file formats: .css and .scss
      test: /\.s?css$/,
      exclude: /node_modules/,
      use: ExtractTextPlugin.extract({
        use: [{
          loader: 'css-loader'
        }, {
          loader: 'postcss-loader',
          options: {
            plugins: (loader) => {
              const plugins = [
                require('autoprefixer')
              ];

              if (!IS_PROD) {
                plugins.push(require('stylelint')({
                  fix: true,
                }))
              }

              return plugins;
            },
          },
        }, {
          loader: 'sass-loader',
          options: {
            includePaths: [
              path.resolve(__dirname, '../../content/jcr_root/apps/__appsFolderName__/components/webpack.resolve/'),
            ],
          },
        }]
      })
    }]
  },
  output: {
    filename: '[name].bundle.js',
    library: libraryName,
    path: outputPath
  },
  plugins: [
    extractCSS,
  ],
  // If your node_modules folder is not in a parent folder of all source files, webpack cannot find the loader. That's shy we have to set an absolute path using the resolveLoader.root option.
  resolve: {
    extensions: ['.js', '.scss'],
    modules: [
      path.resolve(__dirname, '../../content/jcr_root/apps/__appsFolderName__/components/webpack.resolve/'),
      NODE_MODULES
    ]
  },
  watchOptions: {
    ignored: [
      /node_modules/,
      '**/*.bundle.css',
      '**/*.bundle.js',
      '**/*.html',
      '**/*.xml'
    ]
  }
}
