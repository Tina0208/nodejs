require('dotenv').config();
//
console.log(process.env.NODE_ENV);

const express = require('express');
const session = require('express-session');
const MysqlStore = require('express-mysql-session')(session);
const moment = require('moment-timezone');
const multer = require('multer');
// const upload = multer({dest: 'tmp_uploads'});
const upload = require(__dirname + '/modules/upload-imgs');
const fs = require('fs').promises;
//require('內建套件的id')
const db = require(__dirname + '/modules/connect-db');
const sessionStore = new MysqlStore({},db);
const cors = require('cors');


const app = express();
app.set('view engine', 'ejs');

/* 順序影響結果，上面優先執行
app.get('/a.html', (req, res)=>{
    res.send(`<h2>動態內容</h2><p>${Math.random()}</p>`);
});
*/
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static('public'));
app.use(express.static('node_modules/joi/dist/'));

app.use(session({
    secret: 'dfjdklfjdklfjdklsfjirjueifjd;ksmfjdklsfjoifje',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        maxAge: 3000
    }
}))

app.use((req,res,next) => {
    res.locals.amy = "哈囉";


    //樣板輔助函式
    res.locals.toDateString = d => moment(d).format('YYYY-MM-DD');
    res.locals.toDatetimeString = d => moment(d).format('YYYY-MM-DD HH:mm:ss');
    
    next();
})

//.get()為方法，也可以用POST
app.get('/',(req,res)=>{
    // res.send('Hello');
    res.render('home',{name: 'Shinder'});
    //有樣板時才能render
})

// app.get('/json-sales',(req,res)=>{
//     const sales = require("./data/sales.json")
//     res.send(sales[0].name);
// })

app.get('/json-sales',(req,res)=>{
    const sales = require("./data/sales.json")
    res.render('json-sales',{sales});
})

app.get('/try-qs',(req,res)=>{
    res.json(req.query);
})

// const urlencodedParser = express.urlencoded({extended: false});
// app.post('/try-post',urlencodedParser,(req,res)=>{
//     res.json(req.body);
// })

app.post('/try-post',(req,res)=>{
    res.json(req.body);
})

app.get('/try-post-form',(req,res)=>{
    res.render('try-post-form');
})

app.post('/try-post-form',(req,res)=>{
    res.json(req.body);
})

// app.post('/try-upload',upload.single('avatar'), async (req,res)=>{
//     const types = ['image/jpeg','image/png'];
//     const f = req.file;
//     if(f && f.originalname){
//         if(types.includes(f.mimetype)){
//             await fs.rename(f.path, __dirname + '/public/img/' + f.originalname);
//             return res.redirect('/img/' + f.originalname); //用return 讓其執行完就不往下執行了。 以防執行2次res.send，會造成送2次擋頭錯誤。
//         }else {
//             return res.send("檔案類型不符");
//         }
//     }
//     res.send('bad');
// })

// app.post('/try-upload',upload.single('avatar'), async (req,res)=>{
//     res.json(req.file);
// })

app.post('/try-upload',upload.array('photos'), async (req,res)=>{
    const  result = req.files.map(el => {
       return {
            "mimetype": el.mimetype,
            "filename": el.filename,
            "size": el.size
        }
    });
    res.json(result);
})

app.get("/my-params/:action/:id", (req,res) => {
    res.json(req.params);
})

app.get(/\/m\/09\d{2}-?\d{3}-?\d{3}$/i, (req,res) => {
    let u = req.url.split('?')[0];
    u = u.slice(3);
    
    // 用空字串取代掉所有的 -
    u = u.replace(/-/g, '');  // u = u.split('-').join('');

    res.json({mobile: u});
})


app.use( '/admin' , require('./routes/admin2') )
app.use('/address-book',  require('./routes/address-book') );

app.get("/try-session", (req,res) => {
    req.session.myvar = req.session.myvar || 0;
    req.session.myvar++;
    res.json(req.session);
})

app.get("/try-moment", (req,res)=>{
    const fm = 'YYYY-MM-DD HH:mm:ss';
    res.json({
        mo1: moment().format(fm),
        mo2: moment().tz('Asia/Tokyo').format(fm),
        mo3: moment(req.session.cookie.expires).format(fm),
        mo4: moment(req.session.cookie.expires).tz('Europe/London').format(fm),
    })
})

app.get("/try-db", async (req,res) => {
    const sql = "SELECT * FROM `address_book` LIMIT 5";
    const [rs, fields] = await db.query(sql);
    res.json(rs);
})

//404網頁要寫在所有路由的最後
app.use((req,res) => {
    res.status(404).send("找不到網頁");
})

const PORT = process.env.PORT || 3001;
app.listen(PORT,()=>{
    console.log('sever started',PORT,new Date());
})