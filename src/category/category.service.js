const pool = require('../database/database')

module.exports = {
    getAllCategory:(callBack)=>{
        pool.query(
            'SELECT * FROM tblExpenseCategory',
            (error, results, fields)=>{
                if(error){
                    return callBack(error)
                }
                let expenseCategoryArray = []
                let incomeCategoryArray = []
                results.forEach(element => {
                    element.categoryType == 1 ? expenseCategoryArray.push(element) : incomeCategoryArray.push(element)
                });
                results = {
                    incomeCategory:incomeCategoryArray.sort((a, b) => a.categoryName.localeCompare(b.categoryName)),
                    expenseCategory:expenseCategoryArray.sort((a, b) => a.categoryName.localeCompare(b.categoryName))
                }
                return callBack(null,results)
            }
        )
    },
    getCategoryById:(id,callBack)=>{
        pool.query(
            'SELECT * FROM tblExpenseCategory WHERE categoryId = ?',
            [id],
            (error, results, fields)=>{
                if(error){
                    return callBack(error)
                }
                return callBack(null,results[0])
            }
        )
    },
    insertCategory:(data,callBack)=>{
        const {categoryType,categoryName} = data
        pool.query(
            'INSERT INTO tblExpenseCategory (categoryType,categoryName)',
            [categoryType,categoryName],
            (error, results, fields)=>{
                if(error){
                    return callBack(error)
                }
                return callBack(null,results)
            }
        )
    }
}