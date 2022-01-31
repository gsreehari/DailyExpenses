const router = require("express").Router()
const {validateToken} = require('../jwt/jwt')
const { upload } = require('../fileUpload/fileUploader');
const {
    getAllExpenses,
    getExpenseById,
    getExpenseByUser,
    addExpense
} = require('./expense.controller')

router.get("/getAllExpenses", validateToken, getAllExpenses)
router.get("/getExpenseById/:expenseId", validateToken, getExpenseById)
router.get("/getExpenseByUser/:userId", validateToken, getExpenseByUser)
router.post("/addExpense", validateToken, upload("tblExpenseDetails","expense").single('file'), addExpense)

module.exports = router