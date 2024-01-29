const Product = require("../db/models/product");
const Order = require("../db/models/order");
const {sha1} = require('js-sha1');
const axios = require("axios");

class ProductController {
    async getAll(req, res, next) {
        const data = await Product.findAll({ include: {all: true, nested: true}})

        return res.json({data})
    }

    async pay(req, res, next) {
        const {
            username, email, country, amount, products
        } = req.body

        const data = {url: null}

        if(country === 'ru') {

        } else {
            const order = await Order.create({
                username, email, country, amount
            })
            await order.setProducts(products)

            const rate = await axios.get("https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/rub/uah.json")
            const amount_in_uah = rate.data.uah * amount

            const params = {
                order_id: order.id,
                merchant_id: process.env.FONDT_MERCHANT_ID,
                order_desc: 'Покупка товаров в GRIMWORLD',
                amount: amount_in_uah,
                currency: 'UAH',
            }

            function generateSignature(params) {
                const data = params.sort((a, b) => a.localeCompare(b))
                data.unshift(process.env.FONDY_MERCHANT_PASSWORD)
                const signature = data.json('|')
                return sha1(signature)
            }

            const signature = generateSignature(params)

            const rs = await axios.post('https://pay.fondy.eu/api/checkout/redirect/', {
                ...params, signature
            })

            const {checkout_url, payment_id} = rs.data

            data.url = checkout_url
            order.payment_id = payment_id
            await order.save()
        }

        return res.json({data})
    }

    async payCallback(req, res, next) {
        console.log(req.body)

        return res.json({success: true})
    }
}

module.exports = new ProductController()