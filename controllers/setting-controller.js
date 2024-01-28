const Setting = require("../db/models/setting");
const util = require('minecraft-server-util');

class SettingController {
    async getAll(req, res, next) {
        const settings = await Setting.findAll()
        const data = {}

        settings.forEach(({key, value}) => {
            data[key] = value
        })

        return res.json({data})
    }
    async getOnline(req, res, next) {
        const result = await util.queryBasic(process.env.MINECRAFT_HOST, parseInt(process.env.MINECRAFT_PORT), { enableSRV: true })

        return res.json({data: result.players})
    }
}

module.exports = new SettingController()