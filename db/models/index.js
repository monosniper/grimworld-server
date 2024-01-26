const Product = require("./product")
const Category = require("./category")
const Craft = require("./craft")
const CraftItem = require("./craft-item")
const Item = require("./item")
const Media = require("./media")

Product.belongsTo(Category, {as: "Category"})

// Craft.belongsToMany(Item, {
//     as: "Items",
//     through: CraftItem,
//     // uniqueKey: 'my_id'
//     // unique: false
// })

Craft.hasMany(CraftItem, {as: "Items"});
CraftItem.belongsTo(Craft, {as: "Craft"});

Item.hasMany(CraftItem, {as: "CraftItem"});
CraftItem.belongsTo(Item, {as: "Item"});

Craft.belongsTo(Item, {as: "Result", foreignKey: "resultId"})

Product.belongsTo(Media, {as: "Media"})
Item.belongsTo(Media, {as: "Media"})