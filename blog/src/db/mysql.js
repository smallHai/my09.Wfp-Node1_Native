const mysql = require("mysql")
const env = process.env.NODE_ENV


let config = {}
if(env ==="dev"){
    config = {
        host: "localhost",
        port: "3306",
        user: "root",
        password: "123456",
        database: "my_blog"
    }
}
if(env ==="production"){
    config = {
        host: "localhost",
        port: "3306",
        user: "root",
        password: "123456",
        database: "my_blog"
    }
}

// 创建链接对象
let con = mysql.createConnection(config)

// 开始链接
con.connect()

// 数据库操作
const exec = (sql)=>{
    let promise = new Promise((resolve,reject)=>{
        con.query(sql, (err, result)=>{
            if(err){
                reject(err)
                return
            }else{
               resolve(result)
            }
        })
    })
    return promise
}

// 关闭链接 实际项目中，要保持连接，随时查询
// con.end()


module.exports = {
    exec,
    escape: mysql.escape
}