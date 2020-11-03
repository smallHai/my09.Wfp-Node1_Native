const redis = require("redis");

// 创建客户端
const redisClient = redis.createClient(6379,"127.0.0.1")

// 监听异常
redisClient.on("error", err=>{
    console.log(err)
})

// 基本操作
redisClient.set("myname", "testname", redis.print)
redisClient.get("myname", (err, val)=>{
    if(err){
        console.log(err)
        return
    }else{
        console.log(val)
    }
    redisClient.quit()
})