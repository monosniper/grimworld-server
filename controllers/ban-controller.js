const {Sequelize, QueryTypes} = require("sequelize");

class BanController {
    async getAll(req, res, next) {
        const sequelize = new Sequelize(process.env.DB_NAME_BANS, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
            host: process.env.DB_HOST,
            dialect: 'mysql'
        });

        await sequelize.authenticate();

        const bans = await sequelize.query("SELECT `litebans_bans`.*, `litebans_history`.name FROM `litebans_bans` JOIN `litebans_history` USING(uuid)", { type: QueryTypes.SELECT });
        const kicks = await sequelize.query("SELECT `litebans_kicks`.*, `litebans_history`.name FROM `litebans_kicks` JOIN `litebans_history` USING(uuid)", { type: QueryTypes.SELECT });
        const mutes = await sequelize.query("SELECT `litebans_mutes`.*, `litebans_history`.name FROM `litebans_mutes` JOIN `litebans_history` USING(uuid)", { type: QueryTypes.SELECT });

        const data = []

        bans.forEach(({
            name: username, banned_by_name: by, reason, time, until
        }) => {
            data.push({
                username, by, reason, time, until,
                type: 'ban',
            })
        })

        kicks.forEach(({
            name: username, banned_by_name: by, reason, time, until
        }) => {
            data.push({
                username, by, reason, time,
                type: 'kick',
            })
        })

        mutes.forEach(({
            name: username, banned_by_name: by, reason, time, until
        }) => {
            data.push({
                username, by, reason, time, until,
                type: 'mute',
            })
        })

        return res.json({data})
    }
}

module.exports = new BanController()