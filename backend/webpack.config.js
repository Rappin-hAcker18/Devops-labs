const path = require('path');

module.exports = {
  mode: 'production',
  target: 'node',
  externals: ['aws-sdk'],
  entry: {
    'auth': './src/handlers/auth.ts',
    'courses': './src/handlers/courses.ts',
    'payments': './src/handlers/payments.ts',
    'progress': './src/handlers/progress.ts',
    'users': './src/handlers/users.ts',
    'videos': './src/handlers/videos.ts',
    'analytics': './src/handlers/analytics.ts',
    'webhooks': './src/handlers/webhooks.ts',
  },
  output: {
    path: path.resolve(__dirname, '.webpack'),
    filename: 'src/handlers/[name].js',
    libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimize: true,
  },
};