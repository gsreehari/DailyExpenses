const pool = require('../database/database')

module.exports = {
    getAllExpenses:(callBack)=>{
        pool.query(
            'SELECT ted.expenseId,expenseAmount,expenseType,expenseDate,expenseDescription,expenseMemo,expenseImagePath,tec.categoryType,tec.categoryName,ta.accountType,tu.userEmail FROM tblExpenseDetails as ted INNER JOIN mapExpense as me on me.expenseId = ted.expenseId INNER JOIN tblExpenseCategory as tec on tec.categoryId = me.categoryId INNER JOIN tblAccount as ta on ta.accountId = me.accountId INNER JOIN tblUser as tu on tu.userId = me.userId',
            (error, results, fields)=>{
                if(error){
                    return callBack(error)
                }
                return callBack(null,results)
            }
        )
    },
    getExpenseById:(id,callBack)=>{
        pool.query(
            'SELECT ted.expenseId,expenseAmount,expenseType,expenseDate,expenseDescription,expenseMemo,expenseImagePath,tec.categoryType,tec.categoryName,ta.accountType,tu.userEmail FROM tblExpenseDetails as ted INNER JOIN mapExpense as me on me.expenseId = ted.expenseId INNER JOIN tblExpenseCategory as tec on tec.categoryId = me.categoryId INNER JOIN tblAccount as ta on ta.accountId = me.accountId INNER JOIN tblUser as tu on tu.userId = me.userId WHERE ted.expenseId = ? ',
            [id],
            (error, results, fields)=>{
                if(error){
                    return callBack(error)
                }
                return callBack(null,results.length != 0 ? results[0] : {})
            }
        )
    },

    getExpenseByUser:(userId,callBack)=>{
        pool.query(
            'SELECT ted.expenseId,expenseAmount,expenseType,expenseDate,expenseDescription,expenseMemo,expenseImagePath,tec.categoryType,tec.categoryName,ta.accountType,tu.userEmail FROM tblExpenseDetails as ted INNER JOIN mapExpense as me on me.expenseId = ted.expenseId INNER JOIN tblExpenseCategory as tec on tec.categoryId = me.categoryId INNER JOIN tblAccount as ta on ta.accountId = me.accountId INNER JOIN tblUser as tu on tu.userId = me.userId WHERE tu.userId = ? ',
            [userId],
            (error, results, fields)=>{
                if(error){
                    return callBack(error)
                }
                return callBack(null,results.length != 0 ? results[0] : {})
            }
        )
    },

    addExpense:(data,callBack)=>{
        pool.getConnection((err, connection) => {
            connection.beginTransaction(function(err) {
                if (err) {                  //Transaction Error (Rollback and release connection)
                    connection.rollback(function() {
                        connection.release();
                        //Failure
                    });
                } else {
                    connection.query(
                        'INSERT INTO tblExpenseDetails (expenseAmount,expenseDate,expenseType,expenseDescription,expenseMemo,expenseImagePath) VALUES (?,?,?,?,?,?)', 
                        [
                            data.expenseAmount,
                            data.expenseDate,
                            data.expenseType,
                            data.expenseDescription,
                            data.expenseMemo,
                            data.file ? data.file : ""
                        ], 
                        (err, result) =>{
                            if (err) {          //Query Error (Rollback and release connection)
                                return connection.rollback(() =>{
                                    connection.release();
                                    //Failure
                                });
                            } else {
                                connection.query(
                                    'INSERT INTO mapExpense (expenseId,categoryId,accountId,userId) VALUES (?,?,?,?)', 
                                    [
                                        result.insertId,
                                        data.expenseCategory,
                                        data.expenseAccount,
                                        data.expenseUser
                                    ], 
                                    (err, results) =>{
                                    if (err) {          //Query Error (Rollback and release connection)
                                        return connection.rollback(function() {
                                            connection.release();
                                            //Failure
                                        });
                                    } else {
                                        connection.commit(function(err) {
                                            if (err) {
                                                return connection.rollback(function() {
                                                    connection.release();
                                                    //Failure
                                                });
                                            } else {
                                                connection.release();
                                                return callBack(null,result)
                                                //Success
                                            }
                                        });
                                    }
                                });
                            }
                    });
                }    
            });
        });
    }
}