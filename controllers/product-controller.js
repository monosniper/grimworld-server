const Product = require("../db/models/product");

class ProductController {
    async getAll(req, res, next) {
        const data = await Product.findAll({ include: {all: true, nested: true}})

        return res.json({data})
    }
}

module.exports = new ProductController()