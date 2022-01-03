const {
    getAllCategory,
    getCategoryById,
    insertCategory
} = require('./category.service')

module.exports = {
    getAllCategory:(req,res)=>{
        getAllCategory((error,results)=>{
            if(error){
                return res.status(400).send(error);
            }
            return res.status(200).json({
                status:"success",
                code:"UIS",
                data: results
            })
        })
    },
    getCategoryById:(req,res)=>{
        let id = req.params.categoryId
        getCategoryById(id,(error,results)=>{
            if(error){
                return res.status(400).send(error);
            }
            return res.status(200).json({
                status:"success",
                data: results
            })
        })
    },
    insertCategory:(req,res)=>{
        let body = req.body
        if(body === undefined || body === {}){
            return res.status(400).json({
                status:"fail",
                message: "Data must be provided"
            })
        }
        insertCategory(body,(error,results)=>{
            return res.status(200).json({
                status:"success",
                data: results
            })
        })
    }
}
