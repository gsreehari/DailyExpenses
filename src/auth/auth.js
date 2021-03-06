const jwt = require('../jwt/jwt')
const { hashSync, genSaltSync } = require("bcrypt")
const { compareSync } = require("bcrypt");

const {
    getUserByEmail
} = require('../users/users.service')

module.exports = {
    login:(req,res)=>{
        const body = req.body
        if(body.userEmail == undefined || body.userEmail == "" || body.userPassword == undefined || body.userPassword == ""){
            return res.status(400).json({
                status:"fail",
                message: "Email and password required"
            });
        }

        getUserByEmail(body, true, (err,result)=>{
            if(err){
                return err !== "NF" ? res.status(500).json({
                    status:"fail",
                    code:"DBCE",
                    error:err,
                    message: "error"
                })
                : res.status(404).json({
                    status: "fail",
                    code: "RNF",
                    message: "Username or Password incorrect"
                });
            }
            
            const passresult = compareSync(body.userPassword, result.userPassword);
            if (passresult) {
                result.userPassword = undefined;
                const jsontoken = jwt.sign({ data: result });
                // .cookie('jwt',jsontoken,{httpOnly: true, secure: true })
                return res.json({
                    status: "success",
                    message: "login successfully",
                    code: "LS",
                    result: result,
                    token: jsontoken,
                });
            } else {
                return res.json({
                    status: "failed",
                    code: "LF",
                    message: "Wrong username or password"
                });
            }
        })
    },
    authenticate:(req,res,next)=>{
        return res.status(200).json({
            status:"success",
            code:'VT',
            message:"valid token"
        })
    },
    authenticateRole:(req,res,next)=>{
        
    },
}