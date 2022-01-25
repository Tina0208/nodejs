const http = require('http');
const fs = require('fs').promises;  //內建的方法，轉換成promise


const server = http.createServer((req,res)=>{
    res.writeHead(200,{ //檔頭
        'Content-Type': 'text/html; charset=utf-8'
    });

    //fs.writeFile('存放的檔名及位置','檔案內的內容')
    fs.writeFile('./headers.txt',JSON.stringify(req.headers,null,4))
    .then(()=>{
        res.end('ok');
    })
});

server.listen(3000);