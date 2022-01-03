const pool = require('../database/database')

module.exports = {
    getUserByEmail:(data, callBack)=>{
        pool.query(
            'SELECT tu.userId,tu.userEmail,tu.userPassword,(SELECT GROUP_CONCAT(CONCAT(tblRole.roleId,"-",tblRole.roleString) SEPARATOR ",") FROM mapUserRole as mur LEFT JOIN tblRole on mur.roleId = tblRole.roleId WHERE mur.userId = tu.userId GROUP BY mur.userId) as roles, (SELECT GROUP_CONCAT(tec.categoryId,"-",tec.categoryName,"-",tec.categoryType,"-",tec.categoryStatus) FROM mapUserExpenseCategory as muec INNER JOIN tblExpenseCategory as tec ON muec.expenseCategoryId = tec.categoryId WHERE muec.userId = tu.userId ORDER BY tec.categoryName ASC) as category FROM tblUser as tu WHERE tu.userEmail = ?',
            [
                data.userEmail
            ],
            (error, results, fields)=>{
                if(error){
                    console.log(error)
                    return callBack(error)
                }
                if(results.length == 0){
                    return callBack("NF")
                }
                results.forEach(element => {
                    let roleArray = []
                    let expenseCategoryArray = []
                    let incomeCategoryArray = []

                    element.roles.split(",").forEach(item=>{
                        let roleMap = {}
                        item = item.split("-")
                        roleMap['roleId'] = item[0]
                        roleMap['roleString'] = item[1]
                        roleArray.push(roleMap)
                    })

                    element.category.split(",").forEach(item=>{
                        let categoryMap = {}
                        item = item.split("-")
                        categoryMap['categoryId']  = item[0]
                        categoryMap['categoryName']  = item[1]
                        categoryMap['categoryType']  = parseInt(item[2])
                        categoryMap['categoryStatus']  = item[3]
                        parseInt(item[2]) == 1 ? expenseCategoryArray.push(categoryMap) : incomeCategoryArray.push(categoryMap)
                        
                    })
                    element.roles = roleArray
                    element.incomeCategory = {
                        length: incomeCategoryArray.length,
                        category:incomeCategoryArray.sort((a, b) => a.categoryName.localeCompare(b.categoryName)),
                    }
                    element.expenseCategory = {
                        length: expenseCategoryArray.length,
                        category:expenseCategoryArray.sort((a, b) => a.categoryName.localeCompare(b.categoryName)),
                    }
                    delete element.category
                });
                return callBack(null,results[0])
            }
        )
    },
    getAllUsers:(callBack)=>{
        pool.query(
            'SELECT tu.userId,tu.userEmail,(SELECT GROUP_CONCAT(CONCAT(tblRole.roleId,"-",tblRole.roleString) SEPARATOR ",") FROM mapUserRole as mur LEFT JOIN tblRole on mur.roleId = tblRole.roleId WHERE mur.userId = tu.userId GROUP BY mur.userId) as roles, (SELECT GROUP_CONCAT(tec.categoryId,"-",tec.categoryName,"-",tec.categoryType,"-",tec.categoryStatus) FROM mapUserExpenseCategory as muec INNER JOIN tblExpenseCategory as tec ON muec.expenseCategoryId = tec.categoryId WHERE muec.userId = tu.userId ORDER BY tec.categoryName ASC) as category FROM tblUser as tu',
            (error, results, fields)=>{
                if(error){
                    return callBack(error)
                }
                if(results.length == 0){
                    return callBack("NF")
                }
                results.forEach(element => {
                    let roleArray = []
                    let expenseCategoryArray = []
                    let incomeCategoryArray = []

                    element.roles.split(",").forEach(item=>{
                        let roleMap = {}
                        item = item.split("-")
                        roleMap['roleId'] = item[0]
                        roleMap['roleString'] = item[1]
                        roleArray.push(roleMap)
                    })

                    element.category.split(",").forEach(item=>{
                        let categoryMap = {}
                        item = item.split("-")
                        categoryMap['categoryId']  = item[0]
                        categoryMap['categoryName']  = item[1]
                        categoryMap['categoryType']  = parseInt(item[2])
                        categoryMap['categoryStatus']  = item[3]
                        parseInt(item[2]) == 1 ? expenseCategoryArray.push(categoryMap) : incomeCategoryArray.push(categoryMap)
                        
                    })
                    element.roles = roleArray
                    element.incomeCategory = {
                        length: incomeCategoryArray.length,
                        category:incomeCategoryArray.sort((a, b) => a.categoryName.localeCompare(b.categoryName)),
                    }
                    element.expenseCategory = {
                        length: expenseCategoryArray.length,
                        category:expenseCategoryArray.sort((a, b) => a.categoryName.localeCompare(b.categoryName)),
                    }
                    delete element.category
                });
                
                return callBack(null,results)
            } 
        )
    },
    insertUser:(data, callBack)=>{
        pool.query(
            'INSERT INTO tblUser (userEmail,userPassword) values(?,?)',
            [
                data.userEmail.toLowercase.trim(),
                data.userPassword
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