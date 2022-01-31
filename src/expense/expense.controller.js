const {
    getAllExpenses,
    getExpenseById,
    getExpenseByUser,
    addExpense
} = require('./expense.service')

module.exports = {
    getAllExpenses:(req,res)=>{
        getAllExpenses((error,data)=>{
            if(error){
                return res.status(500).json({
                    status:"fail",
                    error:error,
                    message: "error"
                });
            }
            return res.status(200).json(data)
        })
    },
    getExpenseById:(req,res)=>{
        let {expenseId} = req.params
        if(expenseId === null || expenseId === "")
            return res.status(403).json({
                status:"fail",
                error: "ExpenseId should not be null",
                message: "error"
            });
        getExpenseById(expenseId,(error,results)=>{
            if(error){
                return res.status(500).json({
                    status:"fail",
                    error:error,
                    message: "error"
                });
            }
            return res.status(200).json(results)
        })
    },
    getExpenseByUser:(req,res)=>{
        let {userId} = req.params
        if(userId === null || userId === "")
            return res.status(403).json({
                status:"fail",
                error: "userId should not be null",
                message: "error"
            });
            getExpenseByUser(userId,(error,results)=>{
            if(error){
                return res.status(500).json({
                    status:"fail",
                    error:error,
                    message: "error"
                });
            }
            return res.status(200).json(results)
        })
    },
    addExpense:(req,res)=>{
        let body = req.body
        if(req.file){
            console.log(req.file.filename)
            body.file = req.file.filename
        }
        addExpense(body,(error,results)=>{
            if(error){
                return res.status(500).json({
                    status:"fail",
                    error:error,
                    message: "error"
                });
            }
            return res.status(200).json(results)
        })
    }
}
