const Koa = require('koa'),
    route = require('koa-route'),
    server = require('koa-static'),
    fs = require('fs'),
    path = require('path'),
    app = new Koa();

// 设置静态资源目录
const public = server(path.join(__dirname, '../src')); //静态资源路径
app.use(public);

// 提供给服务器认证ticket是否有效
const authTicket = ctx => {
    const param = ctx.request.query

    ctx.response.type = 'json';
    if (param.ticket) {
        ctx.response.body = {
            code: 200,
            data: '已登录'
        };
    } else {
        ctx.response.body = {
            code: 500,
            data: '未登录'
        };
    }
}

// 登录
const login = ctx => {
    ctx.response.type = 'json';
    ctx.response.body = {
        code: 200,
        data: {
            message: '登录成功',
            ticket: 'secret-asda-asd'
        }
    };
}

app.use(route.get('/authTicket', authTicket));
app.use(route.get('/login', login));


app.listen(4000);
console.log('Server listens on 4000.');