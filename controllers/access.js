const path = require('path')
module.exports = async (swc, options)=>{
	swc = await swc.registerMysqlDao(swc, {
		servicePath: `${path.resolve()}/dao/mysql.js`
	});

	swc = await swc.registerMiddleware(swc, {
		middlewareFilePath: `${path.resolve()}/middlewares`,
	})

	swc = await swc.registerStatic(swc, {
		items: [{
			path: `/${swc.config.server.bussiness_name}/sdk`,
			staticFilePath: `${path.resolve()}/keke_stage/static/sdk`
		}]
	});
	
	swc = await swc.registerHttpService(swc, {
		httpServiceFilePath: `${path.resolve()}/services/http`
	})

	return swc;
}
	