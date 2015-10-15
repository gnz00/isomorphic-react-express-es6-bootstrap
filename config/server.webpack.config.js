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

  devtool: 'source-map',

  entry: path.join(__dirname, '../src/server/server.js'),

  output: {
    publicPath: '/',
    sourcePrefix: '  ',
    path: path.join(__dirname, '../build'),
    filename: 'server.js',
    libraryTarget: 'commonjs2',
  },

  cache: true,
  debug: true,
  target: 'node',
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },

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
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': global.DEBUG ? '"development"' : '"production"',
      __DEV__: global.DEBUG,
    }),
    new webpack.BannerPlugin('require("source-map-support").install();',
      { raw: true, entryOnly: false }),
  ],

  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx'],
    alias: {
      "react-routing$": "react-routing004fix"
    }
  },

  module: {
    loaders: [{
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, '../src/server'),
          path.resolve(__dirname, '../src/shared'),
        ],
        loader: 'babel-loader',
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      }, {
        test: /\.txt$/,
        loader: 'raw-loader',
      }, {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|otf)$/,
        loader: 'url-loader?limit=10000',
      }, {
        test: /\.(eot|ttf|wav|mp3)$/,
        loader: 'file-loader',
      },
      {
        test: /\.css$/,
        loader: 'css-loader!postcss-loader',
      }
    ],
  },

  externals: [
    function filter(context, request, cb) {
      const isExternal =
        request.match(/^[a-z][a-z\/\.\-0-9]*$/i) &&
        !request.match(/^react-routing/) &&
        !context.match(/[\\/]react-routing/);
      cb(null, Boolean(isExternal));
    },
  ],

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