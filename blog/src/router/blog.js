const { ResSuccess,ResError } = require("../model/model.js")
const { getList,getDetail,addBlog,updateBlog,deleteBlog } = require("../controller/blog.js")

// 统一的登陆验证
const loginCheck = (req)=>{
    if(!req.session.username){
        return Promise.resolve(new ResError("未登录"))
    }
}

const handleBlogRouter = (req, res)=>{
    let method = req.method
    let path = req.path
    let id = req.query.id || ""
    let author = req.query.author || ""

    // 接口 -list
    if(method ==="GET" && path ==="/api/blog/list"){
        let keyword = req.query.keyword || ""
        // let listData = getList(author, keyword)
        // let result = new ResSuccess(listData, "OK")
        // return result

        // 判断页面是否是管理页
        // 是管理页，就要判断登陆，并且author只能查自己的博客
        if(req.query.isadmin){
            let loginCheckResult = loginCheck(req)
            if(loginCheckResult){ // 未登陆时有promise返回
                return loginCheckResult
            }
            author = req.session.username
        }

        return getList(author, keyword).then(listData=>{
            let result = new ResSuccess(listData, "OK")
            return result
        })
    }
    // 接口 -detail
    if(method ==="GET" && path ==="/api/blog/detail"){
        // let detailData = getDetail(id)
        // let result = new ResSuccess(detailData, "OK")
        // return result
        return getDetail(id).then(detailData=>{
            let result = new ResSuccess(detailData, "OK")
            return result
        })
    }

    // 接口 -add
    if(method ==="POST" && path ==="/api/blog/add"){
        // let blogData = addBlog(req.body)
        // let result = new ResSuccess(blogData, "OK")
        // return result
        // req.body.author = "zhangsan"

        let loginCheckResult = loginCheck(req)
        if(loginCheckResult){ // 未登陆时有promise返回
            return loginCheckResult
        }

        req.body.author = req.session.username
        return addBlog(req.body).then(blogData=>{
            let result = new ResSuccess(blogData, "OK")
            return result
        })
    }

    // 接口 -delete
    if(method ==="POST" && path ==="/api/blog/delete"){
        // let result = deleteBlog(id)
        // if(result){
        //     return new ResSuccess()
        // }else{
        //     return new ResError("删除失败")
        // }

        let loginCheckResult = loginCheck(req)
        if(loginCheckResult){ // 未登陆时有promise返回
            return loginCheckResult
        }

        let author = req.session.username
        return deleteBlog(id, author).then(deleteResult=>{
            if(deleteResult){
                return new ResSuccess()
            }else{
                return new ResError("删除失败")
            }
        })
    }

    // 接口 -update
    if(method ==="POST" && path ==="/api/blog/update"){
        // let result = updateBlog(id, req.body)
        // if(result){
        //     return new ResSuccess()
        // }else{
        //     return new ResError("更新失败")
        // }

        let loginCheckResult = loginCheck(req)
        if(loginCheckResult){ // 未登陆时有promise返回
            return loginCheckResult
        }

        return updateBlog(id, req.body).then(updateResult=>{
            if(updateResult){
                return new ResSuccess()
            }else{
                return new ResError("更新失败")
            }
        })
    }

}


module.exports = handleBlogRouter