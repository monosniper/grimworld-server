const Craft = require("../db/models/craft");

class CraftController {
    async getAll(req, res, next) {
        const data = await Craft.findAll({ include: {all: true, nested: true}})

        return res.json({data})
    }
}

module.exports = new CraftController()