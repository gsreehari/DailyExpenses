const pool = require('../database/database')
const transaction = require('../services/transactions/transaction') 

module.exports = {
    getUserByEmail:(data, auth, callBack)=>{
        let query = auth ? 'SELECT tu.userId,tu.userEmail,tu.userPassword,(SELECT GROUP_CONCAT(CONCAT(tblRole.roleId,"-",tblRole.roleString) SEPARATOR ",") FROM mapUserRole as mur LEFT JOIN tblRole on mur.roleId = tblRole.roleId WHERE mur.userId = tu.userId GROUP BY mur.userId) as roles, (SELECT GROUP_CONCAT(tec.categoryId,"-",tec.categoryName,"-",tec.categoryType,"-",muec.categoryStatus) FROM mapUserExpenseCategory as muec INNER JOIN tblExpenseCategory as tec ON muec.expenseCategoryId = tec.categoryId WHERE muec.userId = tu.userId ORDER BY tec.categoryName ASC) as category, (SELECT GROUP_CONCAT(tac.accountId,"-",tac.AccountType,"-",mua.accountStatus) FROM mapUserAccount as mua INNER JOIN tblAccount as tac ON mua.accountId = tac.accountId WHERE mua.userId = tu.userId ORDER BY tac.AccountType ASC) as accounts FROM tblUser as tu WHERE tu.userEmail = ?'
                        : 'SELECT tu.userId,tu.userEmail,(SELECT GROUP_CONCAT(CONCAT(tblRole.roleId,"-",tblRole.roleString) SEPARATOR ",") FROM mapUserRole as mur LEFT JOIN tblRole on mur.roleId = tblRole.roleId WHERE mur.userId = tu.userId GROUP BY mur.userId) as roles, (SELECT GROUP_CONCAT(tec.categoryId,"-",tec.categoryName,"-",tec.categoryType,"-",muec.categoryStatus) FROM mapUserExpenseCategory as muec INNER JOIN tblExpenseCategory as tec ON muec.expenseCategoryId = tec.categoryId WHERE muec.userId = tu.userId ORDER BY tec.categoryName ASC) as category, (SELECT GROUP_CONCAT(tac.accountId,"-",tac.AccountType,"-",mua.accountStatus) FROM mapUserAccount as mua INNER JOIN tblAccount as tac ON mua.accountId = tac.accountId WHERE mua.userId = tu.userId ORDER BY tac.AccountType ASC) as accounts FROM tblUser as tu WHERE tu.userEmail = ?'
        
        pool.query(
            query,
            [data.userEmail],
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
                    let accountsArray = []


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

                    element.accounts.split(',').forEach(item=>{
                        let accountMap = {}
                        item = item.split('-')
                        accountMap['accountId'] = item[0]
                        accountMap['accountType'] = item[1]
                        accountMap['accountStatus'] = item[2]
                        accountsArray.push(accountMap)
                    })

                    element.category = {}
                    element.accounts = {}

                    element.roles = roleArray
                    element.accounts = accountsArray.sort((a, b) => a.accountType.localeCompare(b.accountType))
                    element.category.incomeCategory = incomeCategoryArray.sort((a, b) => a.categoryName.localeCompare(b.categoryName))
                    element.category.expenseCategory = expenseCategoryArray.sort((a, b) => a.categoryName.localeCompare(b.categoryName))
                });
                return callBack(null,results[0])
            }
        )
    },
    getAllUsers:(callBack)=>{
        pool.query(
            'SELECT tu.userId,tu.userEmail,(SELECT GROUP_CONCAT(CONCAT(tblRole.roleId,"-",tblRole.roleString) SEPARATOR ",") FROM mapUserRole as mur LEFT JOIN tblRole on mur.roleId = tblRole.roleId WHERE mur.userId = tu.userId GROUP BY mur.userId) as roles, (SELECT GROUP_CONCAT(tec.categoryId,"-",tec.categoryName,"-",tec.categoryType,"-",muec.categoryStatus) FROM mapUserExpenseCategory as muec INNER JOIN tblExpenseCategory as tec ON muec.expenseCategoryId = tec.categoryId WHERE muec.userId = tu.userId ORDER BY tec.categoryName ASC) as category, (SELECT GROUP_CONCAT(tac.accountId,"-",tac.AccountType,"-",mua.accountStatus) FROM mapUserAccount as mua INNER JOIN tblAccount as tac ON mua.accountId = tac.accountId WHERE mua.userId = tu.userId ORDER BY tac.AccountType ASC) as accounts FROM tblUser as tu',
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
                    let accountsArray = []

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

                    element.accounts.split(',').forEach(item=>{
                        let accountMap = {}
                        item = item.split('-')
                        accountMap['accountId'] = item[0]
                        accountMap['accountType'] = item[1]
                        accountMap['accountStatus'] = item[2]
                        accountsArray.push(accountMap)
                    })

                    element.category = {}
                    element.accounts = {}

                    element.accounts = accountsArray
                    element.roles = roleArray
                    element.category.incomeCategory = {
                        length: incomeCategoryArray.length,
                        category:incomeCategoryArray.sort((a, b) => a.categoryName.localeCompare(b.categoryName)),
                    }
                    element.category.expenseCategory = {
                        length: expenseCategoryArray.length,
                        category:expenseCategoryArray.sort((a, b) => a.categoryName.localeCompare(b.categoryName)),
                    }
                    
                });
                
                return callBack(null,{users:results})
            } 
        )
    },
    insertUser:(data, callBack)=>{

        let queries = [
            {
                query:'INSERT INTO tblUser (userEmail, userPassword) VALUES (?,?)', 
                data :  [
                            data.userEmail.trim(),
                            data.userPassword
                        ],
            },
            {
                query:'INSERT INTO mapUserRole (userId,roleId) VALUES (?,?)', 
                data :  [
                            {
                                queryResult : 1,
                                field: "insertId"
                            },
                            data.role
                        ]
            },
            {
                query:'INSERT INTO mapUserAccount (userId,accountId,accountStatus) VALUES ?', 
                type:'multiple',
                data :  [...Array(4).keys()].map((item)=>{
                            return [
                                {
                                    queryResult : 1,
                                    field: "insertId"
                                },
                                item+1,
                                1
                            ]
                        })
            },
            {
                query:'INSERT INTO mapUserExpenseCategory (userId,expenseCategoryId,CategoryStatus) VALUES ?',
                type:'multiple',
                data:[...Array(12).keys()].map((item)=>{
                        return [
                            {
                                queryResult : 1,
                                field: "insertId"
                            },
                            item+1,
                            1
                        ]
                    })
            }
        ]

        transaction(queries,(error, result)=>{
            return callBack(error,result)
        })
    }
}