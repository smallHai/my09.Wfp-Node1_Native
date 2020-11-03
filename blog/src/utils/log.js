const fs = require("fs")
const path = require("path")

// 写入流
const createWriteStream = (fileName)=>{
    const fullFileName = path.join(__dirname, "../", "../", "logs", fileName)
    const writeStream = fs.createWriteStream(fullFileName, {flags: "a"})
    return writeStream
}

// 三个日志写入
const accessWrite = (log)=>{
    let accessStream = createWriteStream("access.log")
    accessStream.write(log + "\n")
}

const eventWrite = (log)=>{
    let eventStream = createWriteStream("event.log")
    eventStream.write(log + "\n")
}

const errorWrite = (log)=>{
    let errorStream = createWriteStream("error.log")
    errorStream.write(log + "\n")
}


// 读取流
// const createReadStream = (faliName)=>{}


module.exports = {
    accessWrite,
    eventWrite,
    errorWrite
}