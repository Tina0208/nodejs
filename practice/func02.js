const f1 = require("./func01"); 
//匯入。副檔名為.js 或 .json 時，可省略副檔名。
//require不一定要寫在第一行。
// const f1 = require(__dirname + '/func01'); //另一種匯入的寫法

console.log("func02:", f1(8));

