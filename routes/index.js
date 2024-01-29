const express = require('express');
const router = express.Router();

const ProductController = require("../controllers/product-controller");
const CraftController = require("../controllers/craft-controller");
const BanController = require("../controllers/ban-controller");
const SettingController = require("../controllers/setting-controller");

router.get("/products", ProductController.getAll);
router.get("/crafts", CraftController.getAll);
router.get("/bans", BanController.getAll);
router.get("/settings", SettingController.getAll);
router.get("/online", SettingController.getOnline);
router.post("/pay", ProductController.pay);
router.post("/pay-callback-fc", ProductController.payCallbackFC);
router.post("/pay-callback", ProductController.payCallback);

module.exports = router;
