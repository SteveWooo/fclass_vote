
const Sequelize = require("sequelize");
exports.defineModel = async function defineModel(swc){
	swc.dao.models.users = swc.dao.seq.define("users", {
		user_id: { type: Sequelize.STRING(32) }, //唯一ID
		nick_name: { type: Sequelize.TEXT }, //昵称
		avatar_url: { type: Sequelize.TEXT },
		session_key: { type: Sequelize.TEXT },
		openid: { type: Sequelize.TEXT },

		create_by: { type: Sequelize.STRING(32) },
		update_by: { type: Sequelize.STRING(32) },
		create_at: { type: Sequelize.STRING(13) },
		update_at: { type: Sequelize.STRING(13) },
	})
	return swc;
}

exports.defineIndex = async function defineIndex(swc){
	// swc.dao.models.demos.belongsTo(swc.dao.models.admins, {
	// 	foreignKey : 'create_by', //多的一个数据实体
	// 	targetKey : 'admin_id', //少的一个数据实体
	// 	as : 'admin'
	// })

	swc.log.info('载入:数据索引');
	return swc;
}
