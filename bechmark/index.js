const actix = require("../index");

actix.get('/', (req) => {
  req.sendText("hello world");
});

const host = '127.0.0.1:8080'

actix.start(host);

const http = require('http');

http.createServer((request, response) => {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  // 发送响应数据 "Hello World"
  response.end('hello world');
}).listen(8081);
