# 利用nodeJs实现的单点登录demo

## 一、操作流程
1. 启动服务：sso认证服务和应用服务
```bash
npm install
npm run server
npm run client
```
2. 浏览器代开打开http://127.0.0.1:3000进入应用客户端
3. 点击‘是否登录’按钮，进行登录流程，登录完成之后会在客户端生产cookie: userId=1，就表示单点登录完成

## 二、登录流程 
1. 应用平台前端XHR请求头部带上特殊字段(如IS-XHR)，区别其他静态资源的请求，进入页面之后，发起一个接口请求 www.app.com/api
2. 应用平台后端服务在检测请求没登录的情况下，如果是XHR请求(有IS-XHR header字段)，则返回http code是200，response.body：
```javascript
{
    statusCode: 302,
    data: 'http://www.sso.com?service=www.app.com/api'
}
```
让前端控制跳转到单点登录服务页面
```JavaScript
if (res.statusCode === 302) {
    window.location.href = res.data
}
```
如果是静态资源请求，这正常重定向返回http code是302，设置response Location头部字段为 http://www.sso.com?service=www.app.com/api  
3. 跳到单点登录服务页面之后，用户输完信息，点击登录，登录完成之后后端返回登录凭证ticket，用静态资源请求的方式请求之前应用平台的接口路径+ticket
```
www.app.com/api?ticket=screte-aa-bb
```
4. 应用平台后端拿到ticket之后去单点登录平台后端认证，认证成功之后在应用平台set-cookie，并返回http code是302，再次跳转到应用平台的页面 www.app.com，此时应用平台已有cookie，登录成功！