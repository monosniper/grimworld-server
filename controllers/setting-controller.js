const Setting = require("../db/models/setting");

class SettingController {
    async getAll(req, res, next) {
        const settings = await Setting.findAll()
        const data = {}

        settings.forEach(({key, value}) => {
            data[key] = value
        })

        return res.json({data})
    }
}

module.exports = new SettingController()