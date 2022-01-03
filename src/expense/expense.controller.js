const {
    getExpenses
} = require('./expense.service')

module.exports = {
    getExpenses:(req,res)=>{
        getExpenses((error,data)=>{
            if(error){
                res.send(error);
            }
            res.send(data);
        })
    }
}
