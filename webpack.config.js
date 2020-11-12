let path = require('path');
let MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

let conf = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, './dist/'),
        filename: '[name].js',
        publicPath: '' // 'dist/'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin({
            template: './src/index.html'
          }),
          new CopyWebpackPlugin({
            patterns: [
              {
                from: path.resolve(__dirname, 'src/favicon.ico'),
                to: path.resolve(__dirname, 'dist')
              },
              { from: path.resolve(__dirname, 'assets'), to: path.resolve(__dirname, 'dist/assets') },
            ]
          }),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [
                            "@babel/plugin-transform-react-jsx",
                            ["@babel/plugin-proposal-decorators", { "legacy": true }],
                            ["@babel/plugin-proposal-class-properties", { "loose": true }]
                        ]
                    }
                }
            },
            {
                test: /\.module\.css$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
							publicPath: './static',
                            minimize: true
                            //hmr: process.env.NODE_ENV === 'development'
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: {
                                localIdentName: '[local]__[sha1:hash:hex:7]'
                            }
                        }
                    }
                ]
            },
            {
                test: /^((?!\.module).)*css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development',
                        }
                    }, 
                    'css-loader'
                ]
            },
			{
				test: /\.less$/,
				use: [
				/*
				  { loader: 'style-loader' },
				  { loader: 'css-loader' },
				  */
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							//hmr: process.env.NODE_ENV === 'development'
						}
					},
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1,
							modules: {
								localIdentName: '[local]'
								//localIdentName: '[local]__[sha1:hash:hex:7]'
							}
						}
					},
				  
				  //------
				  {
					loader: 'less-loader',
					options: {
					  javascriptEnabled: true
					  //modifyVars: themeVars,
					},
				  },
				],
			}
        ]
    },
    resolve: {
        alias: {
            '~': path.resolve(__dirname, 'src'),
            '~c': path.resolve(__dirname, 'src/components'),
            '~p': path.resolve(__dirname, 'src/pages'),
            '~s': path.resolve(__dirname, 'src/store')
        }
    },
    devServer: {
        historyApiFallback: true,
        overlay: true
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    name: `chunk-vendors`,
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    chunks: 'initial'
                },  
                common: {
                    name: `chunk-common`,
                    minChunks: 2,
                    priority: -20,
                    chunks: 'initial',
                    reuseExistingChunk: true
                }
            }
        }
    }
};

module.exports = conf;
