const redis = require("redis");
const env = process.env.NODE_ENV

let config = {}
if(env ==="dev"){
    config = {
        port: "6379",
        host: "127.0.0.1"
    }
}
if(env ==="production"){
    config = {
        port: "6379",
        host: "127.0.0.1"
    }
}

// 创建客户端
const { port,host } = config
const redisClient = redis.createClient(port, host)

// 监听异常
// redisClient.on("error", err=>{
//     console.log(err)
// })

// 基本操作
// redisClient.set("myname", "testname", redis.print)
// redisClient.get("myname", (err, val)=>{
//     if(err){
//         console.log(err)
//         return
//     }else{
//         console.log(val)
//     }
//     redisClient.quit()
// })

const setRedis = (key, val)=>{
    if(typeof val ==="object"){
        val = JSON.stringify(val)
    }
    redisClient.set(key, val)
}

const getRedis = (key)=>{
    let promise = new Promise((resolve, reject)=>{
        redisClient.get(key, (err, val)=>{
            if(err){
                reject(err)
                return
            }else{
                // resolve(val)
                if(val ==null){
                    resolve(null)
                    return
                }

                try{
                    resolve(JSON.parse(val))
                }catch(ex){
                    resolve(val)
                }
            }
            // 退出redis
            // redisClient.quit()
        })
    })
    return promise
}

module.exports = {
    setRedis,
    getRedis
}