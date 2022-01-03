const router = require("express").Router();
const {validateToken} = require('../jwt/jwt')
const {authenticateRole} = require('../auth/auth')
const {
    getUserByEmail,
    getAllUsers,
    insertUser,
} = require('./users.controller')


router.get("/user/:email",validateToken, getUserByEmail);
router.get("/getAllUsers",validateToken, getAllUsers);
router.post("/addUser", validateToken, insertUser);

module.exports = router