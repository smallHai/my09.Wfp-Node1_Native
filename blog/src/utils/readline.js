// 分析日志中Chrome浏览器占比
// 日志文件是一行行写的，每一行就是一个日志情况

const fs = require("fs")
const path = require("path")
const readline = require("readline")


const fileName = path.join(__dirname, "../", "../", "logs", "access.log")
const readStream = fs.createReadStream(fileName)

// 创建readline实例和输入流
const rl = readline.createInterface({
    input: readStream
})

let chromeNum = 0
let totalNum = 0

// 逐行读取
rl.on("line", lineData=>{
    if(!lineData){
        return
    }else{
        totalNum++
        let arr = lineData.split(" - ")
        if(arr[2] && arr[2].indexOf("Chrome") !=-1){
            chromeNum++
        }
    }
})

// 读取完成
rl.on("close", ()=>{
    // console.log("Chrome占比：" + (chromeNum / totalNum) * 100 + "%")
    console.log(`Chrome占比：${(chromeNum / totalNum) * 100}%`)
})