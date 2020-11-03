const xss = require("xss")
const { exec } = require("../db/mysql.js")

const getList = (author, keyword)=>{
    let sql = `select * from blogs where 1=1 ` //1=1为了避免author和keyword都无值会出错
    if(author){
        sql += `and author="${author}" `
    }
    if(keyword){
        sql += `and title like "%${keyword}%" `
    }
    sql += `order by createtime desc;`
    return exec(sql)
}

const getDetail = (id)=>{
    let sql = `select * from blogs where 1=1 and id="${id}" `
    return exec(sql).then(rows=>{ //因为此处查询出来的是一个数组
        return rows[0]
    })
    // return exec(sql)
}

const addBlog = (data={})=>{
    let title = xss(data.title)
    let content = data.content
    let author = data.author
    let createtime = Date.now()
    let sql = `
        insert into blogs (title,content,author,createtime)
        values ("${title}","${content}","${author}","${createtime}")
    `
    return exec(sql).then(insertData=>{
        return {
            id: insertData.insertId
        }
    })
}

const updateBlog = (id, data={})=>{
    let title = data.title
    let content = data.content
    let sql = `update blogs set title="${title}", content="${content}" where id="${id}" `
    return exec(sql).then(updateData=>{
        if(updateData.affectedRows >0){
            return true
        }else{
            return false
        }
    })
}

const deleteBlog = (id, author)=>{
    let sql = `delete from blogs where id="${id}" and author="${author}" `
    return exec(sql).then(deleteData=>{
        if(deleteData.affectedRows >0){
            return true
        }else{
            return false
        }
    })
}


module.exports = {
    getList,
    getDetail,
    addBlog,
    updateBlog,
    deleteBlog
}