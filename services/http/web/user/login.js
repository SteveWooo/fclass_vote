const crypto = require('crypto');
const request = require('request');

async function createSessionKey(swc, options){
	var userIdSource = [
		'web',
		'users',
		options.openid,
		swc.config.server.public_salt
	].join('&');

	var userId = crypto.createHash('md5').update(userIdSource).digest('hex');
	var now = +new Date();
	var sessionKeySource = [
		'web',
		'users',
		options.openid,
		now,
		swc.config.server.public_salt
	].join('&');

	var sessionKey = crypto.createHash('md5').update(sessionKeySource).digest('hex');

	var user = await swc.dao.models.users.findAndCountAll({
		where : {
			user_id : userId
		}
	})

	if(user.count == 0){
		var newUser = {
			user_id : userId,
			nick_name : userId.substring(0, 8),
			avatar_url : '',
			openid : options.openid,
			session_key : sessionKey,
			create_by : 'web',
			update_by : 'web',
			create_at : now,
			update_at : now
		}

		var result = await swc.dao.models.users.create(newUser);
		return result;
	} else {

		var updateData = {
			session_key : sessionKey,
			update_at : now,
		}

		if(user.rows[0].nick_name == '') {
			updateData.nick_name = userId.substring(0, 8);
		}

		var result = await user.rows[0].update(updateData);
		return result;
	}
}

module.exports = {
	config : {
		path : '/api/web/user/login',
		method : 'get',
		middlewares : [],
		model : {
			code : 2000,
			session_key : '',
		}
	},
	service : async (req, res, next)=>{
		var query = req.query;
		var swc = req.swc;

		if(query.openid == undefined || query.openid.length != 28){
			req.response = await swc.Error(swc, {
				code : 4003,
			});
			next();
			return ;
		}

		var user = await createSessionKey(swc, {
			openid : query.openid
		})

		// var userInfo = await getUserInfo(swc, {
		// 	openid : query.openid
		// })

		// if(!userInfo){
		// 	req.response = await swc.Error(swc, {
		// 		code : 4003,
		// 	});
		// 	next();
		// 	return ;
		// }

		//set cookie
		// req.responseHeaders["Set-Cookie"] = "webSession=" + user.session_key;
		req.response.user = {
			user_id : user['user_id'],
			nick_name : user['nick_name'],
			session_key : user['session_key']
		}
		next();
	}
}