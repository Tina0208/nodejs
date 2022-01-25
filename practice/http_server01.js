//簡易的WEB SERVER

const http = require('http');

const server = http.createServer((req,res)=>{
    res.writeHead(200,{ //檔頭
        'Content-Type': 'text/html'
    });
    
    res.write(`<div>123</div>`); //中間內容
    res.end(`<h2>Hola</h2> 
    <p>${req.url}</p>`) //讀完的內容
})

server.listen(3000);