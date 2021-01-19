module.exports = {
    module: {
        loaders: [
            {
                test: [/\.md$/],
                loader: require.resolve('url-loader'),
                options: {
                    name: "static/media/[name].[ext]"
                }
            }
        ]
    }
}