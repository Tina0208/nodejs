const http = require('http');
const fs = require('fs');


const server = http.createServer((req,res)=>{
    res.writeHead(200,{ //檔頭
        'Content-Type': 'text/html; charset=utf-8' //
    });

    //fs.writeFile('讀取檔案名',('錯誤','讀取的檔案內容')=>)
    fs.readFile('./headers.txt', (error, data) => {
        if(error){
            console.log(error);
            res.end('錯誤');
        } else {
            res.write(data);
            res.end(data);
        }
    });
});

server.listen(3000);