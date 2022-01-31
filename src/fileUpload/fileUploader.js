const multer = require('multer');
const path = require('path');
const fs = require('fs')
const getId = require('../services/getId');
const { nextTick } = require('process');

function expenseUpload(req,res,next) {
    upload("tblExpenseDetails","expense",()=>{
        return next()
        
    })
}

function upload(tableName,fileName){
    let storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, './public/uploads')
            },
            filename: (req, file, cb) => {
                getId(tableName,(error,result)=>{
                    if(error){
                        return cb(error)
                    }
                    return cb(null, `${fileName}-${result.id}${path.extname(file.originalname)}`)
                })
            }
        });
        
        //will be using this for uplading
        return multer({ 
            storage: storage,
            fileFilter: function (req, file, callback) {
                var ext = path.extname(file.originalname);
                if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
                    return callback(new Error('Only images are allowed'))
                }
                callback(null, true)
            },
            limits:{
                fileSize: 1024 * 1024
            }
        })
}

// var storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './public/uploads/expenses')
//     },
//     filename: (req, file, cb) => {
//         getId("tblExpenseDetails",(error,result)=>{
//             if(error){
//                 return cb(error)
//             }
//             return cb(null, `file-${result.id}${path.extname(file.originalname)}`)
//         })
//     }
// });

// //will be using this for uplading
// const upload = multer({ storage: storage });


// var usersStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         return cb(null, './public/uploads/prifile pics')
//     },
//     filename: (req, file, cb) => {
//         return cb(null,`image-${req.decoded.result.userId}${path.extname(file.originalname)}`)
//     }
// });

// //will be using this for uplading
// const profilePicupload = multer({ storage: usersStorage });

module.exports = {upload}