const http = require('http');
const fs = require('fs');


const server = http.createServer((req,res)=>{
    res.writeHead(200,{ //檔頭
        'Content-Type': 'text/html; charset=utf-8'
    });

    //fs.writeFile('存放的檔名及位置','檔案內的內容',callback function)
    fs.writeFile('./headers.txt',JSON.stringify(req.headers,null,4),error =>{
        if(error){
            console.log(error);
            res.end('錯誤');
        } else {
            res.end('沒問題')
        }
    });
});

server.listen(3000);