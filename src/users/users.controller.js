const {
    getUserByEmail,
    getAllUsers,
    insertUser,
} = require("./users.service")

const { hashSync, genSaltSync } = require("bcrypt")

module.exports = {
    insertUser:(req,res)=>{
        const body = req.body;
        const salt = genSaltSync(10);
        body.userPassword = hashSync(body.userPassword, salt);
        insertUser(body, (err, results) => {
            if (err) {
                return res.status(500).json({
                    status:"fail",
                    code:"DBCE",
                    error:err,
                    message: "error"
                });
            }
            return res.status(200).json({
                status:"success",
                code:"UIS",
                data: results
            });
        });
    },
    getUserByEmail:(req,res)=>{
        let userEmail = req.params.email
        if(userEmail == undefined || userEmail == ""){
            return  res.status(400).json({
                status:"fail",
                code:"DBCE",
                message: "Email required"
            });
        }
        getUserByEmail({userEmail}, false, (err,results)=>{

            if (err === "NF") {
                return res.status(500).json({
                    status: "fail",
                    code: "UNF",
                    message: "User not found"
                });
            }
            if (err) {
                return res.status(500).json({
                    status:"fail",
                    code:"DBCE",
                    error:err,
                    message: "error"
                });
            }
            return res.status(200).json({
                status:"success",
                code:"UIS",
                data: results
            });
        })
    },
    getAllUsers:(req,res)=>{
        getAllUsers((err,results)=>{
            if(err){
                return res.status(500).json({
                    status:"fail",
                    code:"DBCE",
                    error:err,
                    message: "error"
                });
            }
            return res.status(200).json({
                status:"success",
                code:"UIS",
                data: results
            });
        })
    },
}