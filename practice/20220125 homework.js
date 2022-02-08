const http = require('http');
const fs = require('fs');


const server = http.createServer(async (req, res)=>{
    await fileWrite(__dirname + '/headers.txt',JSON.stringify(req.headers, null, 4));
        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8'
              });
        res.end('沒問題');
});

    
    const fileWrite = function(myFilePath, myFileContent){
        return new Promise(function(resolve,reject){
            fs.writeFile(myFilePath, myFileContent, error=>{
                if(error) return reject(error);
            resolve('沒問題')
            }); 
        })
    };
    

server.listen(3000);
