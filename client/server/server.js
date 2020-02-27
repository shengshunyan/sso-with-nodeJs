const Koa = require('koa'),
    route = require('koa-route'),
    server = require('koa-static'),
    fs = require('fs'),
    path = require('path'),
    app = new Koa(),
    http = require("http");

// 设置静态资源目录
const public = server(path.join(__dirname, '../src'));
app.use(public);

// 用户信息认证中间件
const authMiddleware = async (ctx, next) => {
    const headers = ctx.headers
    const id = ctx.cookies.get('userId')
    const param = ctx.request.query

    // 是否已登录
    if (id !== undefined) {
        return next()
    }

    // 如果是同步请求，并且携带了ticket（是单点登录跳转过来）
    if (!headers['is-xhr'] && param.ticket) {
        await new Promise((resolve, reject) => {
            http.get(`http://localhost:4000/authTicket?ticket=${param.ticket}`, function (data) {
                let str = "";
                data.on("data", function (chunk) {
                    str += chunk; // 监听数据响应，拼接数据片段
                })
                data.on("end", function () {
                    const res = JSON.parse(str)
                    if (res.code === 200) {
                        ctx.cookies.set('userId', 1)
                        ctx.response.status = 302
                        ctx.response.set({
                            Location: `http://${ctx.request.header.host}`
                        })
                        resolve()
                    }
                })
            })
        })
    }

    ctx.response.body = {
        code: 302,
        data: {
            url: `http://localhost:4000?service=${ctx.request.header.host}${ctx.request.url}`
        }
    };
}
app.use(authMiddleware)

// 验证是否登录
const getUser = ctx => {
    ctx.response.body = {
        code: 200,
        data: {
            userId: 1
        }
    };
}
app.use(route.get('/getUser', getUser));



app.listen(3000);
console.log('Server listens on 3000.');