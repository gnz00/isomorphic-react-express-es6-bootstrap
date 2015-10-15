import webpack from 'webpack';
import path from 'path';

const AUTOPREFIXER_BROWSERS = [
  'Android 2.3',
  'Android >= 4',
  'Chrome >= 35',
  'Firefox >= 31',
  'Explorer >= 9',
  'iOS >= 7',
  'Opera >= 12',
  'Safari >= 7.1',
];

export default {

  devtool: 'cheap-module-eval-source-map',

  entry: [
    'webpack-hot-middleware/client',
    path.join(__dirname, '../src/client/client.js')
  ],

  output: {
    publicPath: '/',
    sourcePrefix: '  ',
    path: path.join(__dirname, '../build/public'),
    filename: 'client.js'
  },

  cache: true,
  debug: true,

  stats: {
    colors: true,
    reasons: true,
    hash: false,
    version: false,
    timings: false,
    chunks: false,
    chunkModules: false,
    cached: false,
    cachedAssets: false,
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],

  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx']
  },

  module: {
    loaders: [{
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, '../src/client'),
          path.resolve(__dirname, '../src/shared'),
        ],
        loader: 'babel-loader',
        query: {
          // Wraps all React components into arbitrary transforms
          // https://github.com/gaearon/babel-plugin-react-transform
          plugins: ['react-transform'],
          extra: {
            'react-transform': {
              transforms: [
                {
                  transform: 'react-transform-hmr',
                  imports: ['react'],
                  locals: ['module'],
                }, {
                  transform: 'react-transform-catch-errors',
                  imports: ['react', 'redbox-react'],
                },
              ],
            },
          },
        },
      },
      {
        test: /\.css$/,
        loader: 'style-loader/useable!css-loader!postcss-loader',
      }
    ],
  },

  postcss: function plugins() {
    return [
      require('postcss-import')({
        onImport: files => files.forEach(this.addDependency),
      }),
      require('postcss-nested')(),
      require('postcss-cssnext')({ autoprefixer: AUTOPREFIXER_BROWSERS }),
    ];
  },
};