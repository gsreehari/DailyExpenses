// const { sign } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");

module.exports = {
    sign: (data)=>{
        const jsontoken = jwt.sign({ data }, process.env.JWT_ACCESS_TOKEN, {
            expiresIn: "1d"
        });
        return jsontoken
    },
    validateToken: (req, res, next) => {
        let token = req.get("authorization");
        if (token) {
            // Remove Bearer from string
            token = token.slice(7);
            jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, decoded) => {
                if (err) {
                    return res.status(401).json({
                        status:"fail",
                        code: "IT",
                        message: "Invalid Token..."
                    });
                } else {
                    req.decoded = decoded
                    next();
                }
            });
        } else {
            return res.status(401).json({
                status:"fail",
                code:"AD",
                message: "Access Denied! Unauthorized User"
            });
        }
    },
};