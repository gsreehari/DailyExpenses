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
                let eotherElement = {}
                let iotherElement = {}
                results.forEach(element => {
                    if(element.categoryName == "other" && element.categoryType == 1){
                        eotherElement = element
                    }else if(element.categoryName == "other" && element.categoryType == 0){
                        iotherElement = element
                        // continue
                    }else{

                        element.categoryType == 1 ? expenseCategoryArray.push(element) : incomeCategoryArray.push(element)
                    }
                });
                incomeCategoryArray = incomeCategoryArray.sort((a, b) => a.categoryName.localeCompare(b.categoryName))
                expenseCategoryArray = expenseCategoryArray.sort((a, b) => a.categoryName.localeCompare(b.categoryName))

                incomeCategoryArray[incomeCategoryArray.length] = iotherElement
                expenseCategoryArray[expenseCategoryArray.length] = eotherElement
                results = {
                    incomeCategory:incomeCategoryArray,
                    expenseCategory:expenseCategoryArray
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
        pool.query(
            'INSERT INTO tblExpenseCategory (categoryType,categoryName) values(?,?)',
            [
                data.categoryType,
                data.categoryName
            ],
            (error, results, fields)=>{
                if(error){
                    return callBack(error)
                }
                return callBack(null,results)
            }
        )
    }
}