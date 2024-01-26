const express = require('express');
const router = express.Router();

const AdminController = require("../controllers/admin-controller");

router.get("/", AdminController.index);
router.get("/products", AdminController.products);
router.get("/crafts", AdminController.crafts);
router.get("/categories", AdminController.categories);
router.get("/items", AdminController.items);
router.get("/bans", AdminController.bans);

router.get("/products/create", AdminController.createProduct);
router.get("/crafts/create", AdminController.createCraft);
router.get("/categories/create", AdminController.createCategory);
router.get("/items/create", AdminController.createItem);

router.get("/products/:id", AdminController.editProduct);
router.get("/crafts/:id", AdminController.editCraft);
router.get("/categories/:id", AdminController.editCategory);
router.get("/items/:id", AdminController.editItem);

router.post("/products", AdminController.storeProduct)
router.post("/crafts", AdminController.storeCraft)
router.post("/categories", AdminController.storeCategory)
router.post("/items", AdminController.storeItem)

router.post("/products/:id", AdminController.processProduct);
router.post("/crafts/:id", AdminController.processCraft);
router.post("/categories/:id", AdminController.processCategory);
router.post("/items/:id", AdminController.processItem);

router.post("/settings", AdminController.saveSettings);
router.post("/rcon", AdminController.rcon);

router.get("/rcon", AdminController.editRcon);
router.post("/rcon/save", AdminController.updateRcon);

module.exports = router;
