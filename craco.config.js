module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            webpackConfig.module.rules.push({
                test: /pdf\.worker\.(min\.)?js$/,
                use: { loader: "file-loader" },
            });
            return webpackConfig;
        },
    },
};