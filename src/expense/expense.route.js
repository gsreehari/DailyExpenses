const router = require("express").Router();
const {
    getExpenses
} = require('./expense.controller')

router.get("/getExpenses", getExpenses);

module.exports = router