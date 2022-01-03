const pool = require('../database/database')

module.exports = {
    getExpenses:(callBack)=>{
        pool.query(
            'SELECT * FROM tblExpenseDetails',
            (error, results, fields)=>{
                if(error){
                    return callBack(error)
                }
                return callBack(null,results)
            }
        )
    }
}