const router = require("express").Router();
const {validateToken} = require('../jwt/jwt')
const {
    getAllCategory,
    getCategoryById,
    insertCategory
} = require('./category.controller')

router.get("/getAllCategory",validateToken, getAllCategory);
router.get("/getCategoryById/:categoryId",validateToken, getCategoryById);
router.post("/addCategory",validateToken, insertCategory);

module.exports = router