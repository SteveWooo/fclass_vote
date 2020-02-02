module.exports = {
	config : {
		path : '/api/web/user/get_user_id',
		method : 'get',
		middlewares : [],
		model : {
			code : 2000
		}
	},
	service : async (req, res, next)=>{
		var query = req.query;
		var swc = req.swc;

		if(query['web_session'] == undefined){
			req.response = await swc.Error(swc, {
				code : 4003,
				message : '缺少session'
			});
			next();
			return ;
		}

		var user = await swc.dao.models.users.findAndCountAll({
			where : {
				session_key : query['web_session']
			}
		})

		if(user.count == 0){
			req.response = await swc.Error(swc, {
				code : 4003,
				message : 'session无效'
			});
			next();
			return ;
		}

		req.response.user = {
			user_id : user.rows[0].user_id,
			nick_name : user.rows[0].nick_name
		}

		next();
	}
}