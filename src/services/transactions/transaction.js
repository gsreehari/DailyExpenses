const pool = require('../../database/database')


module.exports = function transaction(queries, callBack) {
    let i = 0;
    pool.getConnection((err, connection) => {
        connection.beginTransaction(async function (err) {
            if (err) {                  //Transaction Error (Rollback and release connection)
                connection.rollback(function () {
                    connection.release();
                    //Failure
                });
            } else {
                let results = []
                if(queries.length != 0)
                    executeQuery(connection, queries, 0, results,(error,result)=>{
                        if(error)
                            return callBack(error)
                        return callBack(null,result)
                    })
            }
        });
        if (err) {
            console.log(error)
        }
    });
}

async function executeQuery(connection, queries, index, results, callBack) {
    let data = []
    if(queries[index].type != 'multiple'){
        queries[index].data.forEach(element => {
            if(Array.isArray(element)){
                data.push([element])
            } else if (typeof element === 'object') {
                data.push(results[element.queryResult - 1][element.field])
            } else {
                data.push(element)
            }
        });
    }else{
        queries[index].data.forEach((element,i) => {
            mdata = []
            element.forEach(item=>{
                if (typeof item === 'object') {
                    mdata.push(results[item.queryResult - 1][item.field])
                } else {
                    mdata.push(item)
                }
            })
            data.push(mdata)
        });
        data = [data]
    }
    await connection.query(
        queries[index].query,
        data,
        function (err, result) {
            if (err) {     
                console.log(this.sql)     //Query Error (Rollback and release connection)
                return connection.rollback(function () {
                    connection.release();
                    return callBack(err)
                    //Failure
                });
            } else {
                results.push(result)
                if (index == queries.length - 1) {
                    connection.commit(function (err) {
                        if (err) {
                            return connection.rollback(function () {
                                connection.release();
                                return callBack(err)
                                //Failure
                            })
                        } else {
                            connection.release()
                            return callBack(null, results[0])
                            //Success
                        }
                    });
                } else {
                    return executeQuery(connection, queries, index+1, results,callBack) // execute each qury recursivily
                }
            }
        });
}