require("dotenv").config()

const logger = require('loglevel');

const express = require('express')
const app = express()
const mysql = require('mysql')
const httpServer = require('http').Server(app)
const cors = require('cors')
const router = require("express").Router();


const expenses = require('./src/expense/expense.route')
const users = require('./src/users/users.route')
const category = require('./src/category/category.route')
const {login, authenticate} = require('./src/auth/auth')
const {validateToken} = require('./src/jwt/jwt')



app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
    res.setHeader('Access-Control-Allow-Credentials', true)
    next();
});
app.use(cors());

app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req, res) => {
    return res.json("API :)")
})

app.use("/api/expenses", expenses)
app.use("/api/users", users)
app.use("/api/category", category)

app.get("/api/authenticate",validateToken,authenticate)


app.post("/login",login)

const PORT = process.env.PORT || 9000;

httpServer.listen(PORT, function () {
    // console.log(`listening on port ${PORT}`)
    logger.debug(`listening on port ${PORT}`)
});