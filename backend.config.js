import MongoDB from '@oudy/mongodb'
import ComponentGraphql from '@backend/component-graphql'
import ComponentStatic from '@backend/component-static'
import MemoryFileSystem from '@oudy/memfs'
import RendererVue from '@backend/renderer-vue'

import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import TerserJSPlugin from 'terser-webpack-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'

module.exports = {
    components: [
        ComponentGraphql(),
        // custom component merge
        function (application) {
            // configure memfs
            return MemoryFileSystem.configureWithName('static').then(
                outputFileSystem =>
                Promise.all([
                    // configure static component
                    ComponentStatic({
                        path: '/static',
                        root: './',
                        options: {
                            fs: outputFileSystem
                        }
                    })(application),
                    // configure vue renderrer
                    RendererVue({
                        outputFileSystem,
                        store: true,
                        meta: true,
                        i18n: true,
                        webpack: {
                            client: {
                                module: {
                                    rules: [{
                                            test: /\.(less|css)$/,
                                            use: [
                                                MiniCssExtractPlugin.loader,
                                                // require.resolve('vue-style-loader'),
                                                {
                                                    loader: require.resolve('css-loader'),
                                                    options: {
                                                        url: false,
                                                        // customize generated class names
                                                        // localIdentName: '[local]_[hash:base64:8]'
                                                    }
                                                },
                                                // {
                                                //     loader: require.resolve('less-loader'),
                                                //     options: {
                                                //         relativeUrls: true,
                                                //         globalVars: {
                                                //             '@internal-style': 'white-red'
                                                //         }
                                                //     }
                                                // }
                                            ]
                                        },
                                        {
                                            test: /\.(svg)$/,
                                            use: require.resolve('raw-loader')
                                        }
                                    ]
                                },
                                plugins: [
                                    new MiniCssExtractPlugin({
                                        filename: '[name].[hash].css',
                                        chunkFilename: '[name].[hash].css'
                                    })
                                ],
                                optimization: {
                                    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
                                    runtimeChunk: {
                                        name: 'manifest'
                                    }
                                }
                            },
                            bundle: {
                                module: {
                                    rules: [{
                                        test: /\.(less|css)$/,
                                        use: require.resolve('raw-loader')
                                    }]
                                }
                            },
                            base: {
                                // mode: 'production',
                                // devtool: 'source-map'
                            }
                        }
                    })(application)
                ])
            )
        }
    ],
    async beforeStart() {
        await MongoDB.configure(
            'test',
            'mongodb://localhost:32768', {
                useUnifiedTopology: true
            }
        )
    }
}