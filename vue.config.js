module.exports = {
	outputDir: "dist", //输出目录
	assetsDir: 'static', //输入静态资源的目录
	publicPath: './', //部署时基本url
	indexPath: "index.html", //指定index.html输出路径(相对于dist)
	lintOnSave: false, //是否开启eslint保存检测
	filenameHashing: true,
	runtimeCompiler: false,
	productionSourceMap: true,
	devServer: { //生产环境配置
		open: false,
		host: 'localhost',
		port: 8080,
		https: false,
		hotOnly: false,
		proxy: {
			'/api': {
				target: "http://10.12.42.43/",
				ws: true,
				changeOrigin: true,
				secure: false,
				pathRewrite: {
					"^/api": "",
				}
			}
		},
		before: app => {}
	}
}
