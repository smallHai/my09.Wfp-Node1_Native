const crypto = require("crypto")

// 自定义一个密匙
const secretKey = "mk_node"

// 使用MD5加密
const md5Fn = (val)=>{
    let md5 = crypto.createHash("md5")
    return md5.update(val).digest("hex")
}

// 进行加密
const encrypt = (password)=>{
    const str = `pwd=${password}&key=${secretKey}`
    return md5Fn(str)
}


module.exports = {
    encrypt
}