const querystring = require("querystring")
const handleBlogRouter = require("./src/router/blog.js")
const handleUserRouter = require("./src/router/user.js")
const { setRedis,getRedis } = require("./src/db/redis.js")
const { accessWrite } = require("./src/utils/log.js")

// 全局session数据
// const SessionData = {}

// 设置cookie的过期时间
const setCookieExpires = ()=>{
    let time = new Date()
    time.setTime(time.getTime()+(24*60*60*1000))
    return time.toGMTString()
}

// 处理POST时，返回的数据
const getPostData = (req)=>{
    let promise = new Promise((resolve, reject)=>{
        if(req.method !=="POST"){
            resolve({})
            return
        }
        if(req.headers["content-type"] !=="application/json"){
            resolve({})
            return
        }
        let postData = ""
        req.on("data", chunk=>{
            postData += chunk.toString()
        })
        req.on("end", ()=>{
            if(!postData){
                resolve({})
                return
            }
            resolve(JSON.parse(postData))
        })
    })
    return promise
}

const serverHandle = (req, res) => {
    // 写入access日志
    accessWrite(`${req.method} - ${req.url} - ${req.headers["user-agent"]} - ${Date.now()}`)

    // 返回的数据格式
    res.setHeader("Content-type", "application/json")

    // 示例
    // const resData = {
    //     name: "hai",
    //     site: "mk",
    //     env: process.env.NODE_ENV
    // }
    // res.end(JSON.stringify(resData))


    // 设置公共参数
    let url = req.url
    req.path = url.split("?")[0]
    req.query = querystring.parse(url.split("?")[1])

    req.cookie = {}
    let cookieStr = req.headers.cookie || ""
    cookieStr.split(";").forEach(item=>{
        if(!item){
            return
        }else{
            let arr = item.split("=")
            let key = arr[0].trim()
            let val = arr[1].trim()
            req.cookie[key] = val
        }
    })

    let needSetCookie = false
    let userId = req.cookie.userid

// console.log("req.session 1: ",req.session)
// console.log("SessionData[userId]: ",SessionData[userId])

// 执行login-test
// req.session 1:  undefined
// SessionData[userId]:  undefined
// req.session 2： {}

// 执行login
// req.session 1:  undefined
// SessionData[userId]:  {}
// 这里登录完req.session就有值了

// 执行login-test
// req.session 1:  undefined
// SessionData[userId]:  { username: 'zhangsan', realname: '张三' } --这是啥时候赋的值
// req.session 2： { username: 'zhangsan', realname: '张三' }

    // session处理
    // if(userId){
    //     if(SessionData[userId]){
    //         // 难理解的是，登陆后，再用登陆测试时，SessionData[userId]值是多少
    //         // 因为登陆后在刷新，为什么能保存登陆状态
    //         req.session = SessionData[userId]
    //     }else{
    //         SessionData[userId] = {}
    //         req.session = SessionData[userId]
    //     }
    // }else{
    //     needSetCookie = true
    //     // userId = Date.now() + Math.random()
    //     userId = `${Date.now()}_${Math.random()}`
    //     SessionData[userId] = {}
    //     req.session = SessionData[userId]
    // }

    // redis处理
    if(!userId){
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        setRedis(userId, {})
    }
    req.sessionId = userId
    getRedis(req.sessionId).then(sessinoData=>{
        if(sessinoData ==null){
            setRedis(req.sessionId, {})
            req.session = {}
        }else{
            req.session = sessinoData
        }

        return getPostData(req)
    })
    .then(postData=>{
        req.body = postData

        // 处理blog路由
        // let blogData = handleBlogRouter(req, res)
        // if(blogData){
        //     res.end(JSON.stringify(blogData))
        //     return
        // }
        let blogPromise = handleBlogRouter(req, res)
        if(blogPromise){
            blogPromise.then(blogData=>{
                if(needSetCookie){
                    res.setHeader("Set-Cookie", `userid=${userId};expires=${setCookieExpires()};path=/;httpOnly`)
                }
                res.end(JSON.stringify(blogData))
            })
            return
        }

        // 处理user路由
        // let userData = handleUserRouter(req, res)
        // if(userData){
        //     res.end(JSON.stringify(userData))
        //     return
        // }
        let userPromise = handleUserRouter(req, res)
        if(userPromise){
            userPromise.then(userData=>{
                if(needSetCookie){
                    res.setHeader("Set-Cookie", `userid=${userId};expires=${setCookieExpires()};path=/;httpOnly`)
                }
                res.end(JSON.stringify(userData))
            })
            return
        }

        // 没有匹配路由，则返回404
        res.writeHead(404, {"Content-type": "text/plain"})
        res.write("404 Not Found\n")
        res.end()

    })
}

module.exports = serverHandle