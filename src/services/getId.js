const pool = require('../database/database')

module.exports = function getId(table,callBack){
    return pool.query(
        `SELECT auto_increment as id FROM INFORMATION_SCHEMA.TABLES WHERE table_name = "${table}"`,
        (error, results)=>{
            if(error){
                return callBack(error)
            }
            return callBack(null,results[0])
        }
    )
}