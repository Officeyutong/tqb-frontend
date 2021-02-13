module.exports = {
    module: {
        loaders: [
            {
                test: [/\.md$/],
                loader: require.resolve('url-loader'),
                options: {
                    name: "static/media/[name].[ext]"
                }
            },
            {
                test: [/\.ttf$/],
                loader: require.resolve('url-loader'),
                options: {
                    name: "static/fonts/[name].[ext]"
                }
            }
        ]
    }
}