const { ResSuccess,ResError } = require("../model/model.js")
const { login } = require("../controller/user.js")
const { setRedis } = require("../db/redis.js")

const handleUserRouter = (req, res)=>{
    let method = req.method
    let path = req.path

    // 接口 -login
    if(method ==="POST" && path ==="/api/user/login"){
        // let userName = req.body.userName
        // let passWord = req.body.passWord
        // let { username,password } = req.query
        let { username,password } = req.body
        // let result = login(userName, passWord)
        // if(result){
        //     return new ResSuccess()
        // }else{
        //     return new ResError("登录失败")
        // }
        return login(username, password).then(result=>{
            if(result.username){
                // 操作cookie
                // res.setHeader("Set-Cookie", `username=${result.username};expires=${setCookieExpires()};path=/;httpOnly`)

                // 设置session
                // req.session.username = result.username
                // req.session.realname = result.realname

                // 设置redis
                req.session.username = result.username
                req.session.realname = result.realname
                setRedis(req.sessionId, req.session)

                return new ResSuccess()
            }else{
                return new ResError("登录失败")
            }
        })
    }

    // 接口 -login-test
    // if(method ==="GET" && path ==="/api/user/login-test"){
    //     console.log("req.session 2：", req.session)
    //     if(req.session.username){
    //         return Promise.resolve(new ResSuccess({session: req.session}))
    //     }else{
    //         return Promise.resolve(new ResError("未登录"))
    //     }
    // }


}


module.exports = handleUserRouter