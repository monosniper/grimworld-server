const Product = require("../db/models/product");
const Craft = require("../db/models/craft");
const CraftItem = require("../db/models/craft-item");
const Item = require("../db/models/item");
const Category = require("../db/models/category");
const Setting = require("../db/models/setting");
const Media = require("../db/models/media");
const RCON = require("../services/rcon");
const {writeFile, readFile} = require("fs");

function chunkArray(myArray, chunk_size){
    let index = 0;
    let arrayLength = myArray.length;
    let tempArray = [];

    for (index = 0; index < arrayLength; index += chunk_size) {
        myChunk = myArray.slice(index, index+chunk_size);
        // Do something if you want with the group
        tempArray.push(myChunk);
    }

    return tempArray;
}

class AdminController {
    async index(req, res, next) {
        const defaultSettings = {
            ip1: "100.0.0.0",
            ip2: "100.0.0.0",
            diamonds_coef: 1.5,
            description: "lorem ipsum naxui idi kurwa jalab, onayneski lorem ipsum naxui idi kurwa jalab",
            rules: "lorem ipsum naxui idi kurwa jalab, onayneski lorem ipsum naxui idi kurwa jalab",
            policy: "lorem ipsum naxui idi kurwa jalab, onayneski lorem ipsum naxui idi kurwa jalab",
            telegram: "https://www.google.com",
            youtube: "https://www.google.com",
            tiktok: "https://www.google.com",
            "min_diamonds": 50,
            "max_diamonds": 10000,
            "rcon_souls": "points give %username% %count%",
            "rcon_privilege": "lp user %username% parent addtemp %slug% %time%",
            "rcon_privilege_forever": "lp user %username% parent add %slug%",
        }

        // Object.entries(defaultSettings).forEach(([key, value]) => Setting.create({key, value}))

        const settings = await Setting.findAll()
        const privileges = await Product.findAll({where: {isPrivilege: true}})

        return res.render("index", {
            settings: chunkArray(settings, 2),
            privileges
        })
    }

    async editRcon(req, res, next) {
        return res.render("rcon")
    }

    async updateRcon(req, res, next) {
        const file = "public/rcon.json";

        readFile(file, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }

            writeFile(file, JSON.stringify(req.body), 'utf8', function (err) {
                if (err) return console.log(err);
            });
        });

        return res.json({success: true})
    }

    async saveSettings(req, res, next) {
        Object.entries(req.body).forEach(([key, value]) => {
            Setting.update({value}, {where: {key}})
        })

        return res.redirect("/admin")
    }

    async rcon(req, res, next) {
        const {type, username, count, privilege_slug} = req.body
        const setting = await Setting.findOne({where: {key: type === 'privilege' ? 'rcon_privilege_forever' : 'rcon_souls'}})
        let command = setting.value

        command = command.replaceAll("%username%", username)
        command = command.replaceAll("%slug%", privilege_slug)
        command = command.replaceAll("%count%", count)

        console.log(command)

        await RCON.makeCommand(command)

        return res.redirect("/admin")
    }

    async bans(req, res, next) {
        return res.json({data: []})
    }

    async products(req, res, next) {
        const items = await Product.findAll({include: {all: true, nested: true}})

        return res.render("products", {items})
    }

    async crafts(req, res, next) {
        const items = await Craft.findAll({include: {all: true, nested: true}})

        return res.render("crafts", {items})
    }

    async categories(req, res, next) {
        const items = await Category.findAll()

        return res.render("categories", {items})
    }

    async items(req, res, next) {
        const items = await Item.findAll({include: 'Media'})

        return res.render("items", {items})
    }

    async editProduct(req, res, next) {
        const categories = await Category.findAll()
        const item = await Product.findByPk(req.params.id, {include: 'Media'})

        return res.render("edit/product", {item, categories})
    }

    async editCraft(req, res, next) {
        const items = await Item.findAll({include: {all: true, nested: true}})
        const craft = await Craft.findByPk(req.params.id, {include: {all: true, nested: true}})

        return res.render("edit/craft", {craft, items})
    }

    async editCategory(req, res, next) {
        const item = await Category.findByPk(req.params.id)

        return res.render("edit/category", {item})
    }

    async editItem(req, res, next) {
        const item = await Item.findByPk(req.params.id, {include: 'Media'})

        return res.render("edit/item", {item})
    }

    async createProduct(req, res, next) {
        const categories = await Category.findAll()

        return res.render("create/product", {categories})
    }

    async createCraft(req, res, next) {
        const items = await Item.findAll()

        return res.render("create/craft", {items})
    }

    async createCategory(req, res, next) {
        return res.render("create/category")
    }

    async createItem(req, res, next) {
        return res.render("create/item")
    }

    async storeProduct(req, res, next) {
        const product = await Product.create({
            ...req.body, isPrivilege: req.body.isPrivilege === 'on'
        })

        if(req.files) {
            const { image } = req.files

            image.mv("./public/uploads/" + image.name);

            const media = await Media.create({name: image.name})

            await product.setMedia(media)
        }

        return res.redirect("/admin/products")
    }

    async storeCraft(req, res, next) {
        const {items, resultId} = req.body

        const craft = await Craft.create({ resultId })

        Object.entries(items).forEach(async ([column, item]) => {
            if(item.count !== '') {
                const craftItem = await CraftItem.create({
                    CraftId: craft.id,
                    ItemId: item.id,
                    count: item.count,
                    column,
                })

                await craft.addItem(craftItem)
            }
        })

        return res.redirect("/admin/crafts")
    }

    async storeCategory(req, res, next) {
        await Category.create(req.body)

        return res.redirect("/admin/categories")
    }

    async storeItem(req, res, next) {
        const item = await Item.create(req.body)

        if(req.files) {
            const { image } = req.files

            image.mv("./public/uploads/" + image.name);

            const media = await Media.create({name: image.name})

            await item.setMedia(media)
        }

        return res.redirect("/admin/items")
    }

    async processProduct(req, res, next) {
        if(req.body._method === 'delete') {
            await Product.destroy({where: {id: req.params.id}})
        } else if (req.body._method === 'put') {
            const data = req.body
            delete data._method

            const product = await Product.findByPk(req.params.id)

            if(req.files) {
                const { image } = req.files

                image.mv("./public/uploads/" + image.name);

                const media = await Media.create({name: image.name})

                await product.setMedia(media)
            }

            await product.update({
                ...data,
                isPrivilege: data.isPrivilege === 'on'
            })
        }

        return res.redirect("/admin/products")
    }

    async processCraft(req, res, next) {
        const CraftId = req.params.id

        if(req.body._method === 'delete') {
            await Craft.destroy({where: {id: CraftId}})
        } else if (req.body._method === 'put') {
            const data = req.body
            delete data._method

            Object.entries(data.items).forEach(async ([column, {id, count}]) => {
                const craftItem = await CraftItem.findOne({where: {CraftId, column}})

                if(parseInt(count) && parseInt(id)) {
                    if(!craftItem) {
                        await CraftItem.create({
                            CraftId,
                            ItemId: id,
                            count,
                            column,
                        })
                    } else {
                        await craftItem.update({ItemId: id, count})
                    }
                } else if(craftItem) await craftItem.destroy()
            })
        }

        return res.redirect("/admin/crafts")
    }

    async processCategory(req, res, next) {
        if(req.body._method === 'delete') {
            await Category.destroy({where: {id: req.params.id}})
        } else if (req.body._method === 'put') {
            const data = req.body
            delete data._method

            await Category.update(data, {where: {id: req.params.id}})
        }

        return res.redirect("/admin/categories")
    }

    async processItem(req, res, next) {
        if(req.body._method === 'delete') {
            await Item.destroy({where: {id: req.params.id}})
        } else if (req.body._method === 'put') {
            const data = req.body
            delete data._method

            const item = await Item.findByPk(req.params.id)

            if(req.files) {
                const { image } = req.files

                image.mv("./public/uploads/" + image.name);

                const media = await Media.create({name: image.name})

                await item.setMedia(media)
            }

            await item.update(data)
        }

        return res.redirect("/admin/items")
    }
}

module.exports = new AdminController()