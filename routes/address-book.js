const express = require('express');
const db = require('./../modules/connect-db');
const upload = require('./../modules/upload-imgs');

const router = express.Router();


async function getListData(req, res){
    const perPage = 5; // 每一頁最多幾筆
    // 用戶要看第幾頁
    let page = req.query.page ? parseInt(req.query.page) : 1;
    if(page<1){
        return res.redirect('/address-book/list');
    }

    const conditions = {};
    let search = req.query.search ? req.query.search.trim() : '';
    let sqlWhere = 'WHERE 1';
    if(search){
        sqlWhere += ` AND \`name\` LIKE ${db.escape('%'+search+'%')} `;
        conditions.search = search;
    }

   
    const output = {
        perPage,
        page,
        totalRows: 0,
        totalPages: 0,
        rows: [],
        conditions
    };

    const t_sql = `SELECT COUNT(1) num FROM address_book ${sqlWhere}` ;
    const [rs1] = await db.query(t_sql);
    const totalRows = rs1[0].num;
    let totalPages = 0;
    if(totalRows){
        output.totalRows = totalRows;
        output.totalPages = Math.ceil(totalRows/perPage);
        if(page > output.totalPages){
            return res.redirect(`/address-book/list?page=${output.totalPages}`)
        }

        const sql = `SELECT * FROM \`address_book\` ${sqlWhere} ORDER BY \`sid\` DESC LIMIT ${perPage*(page-1)}, ${perPage}`;
        const [rs2] = await db.query(sql);
        rs2.forEach(el => {
            el.birthday = res.locals.toDateString(el.birthday);
        });
        output.rows = rs2;
    }
        return output;
        
}

router.get('/list', async (req, res)=>{
    res.render('address-book/list', await getListData(req, res));
});

router.get('/api/list', async (req, res)=>{
    res.json(await getListData(req, res));
});

router.get('/add', async (req, res)=>{
    res.render('address-book/add');
});

router.post('/add2', upload.none(), async (req, res)=>{
    res.json(req.body);
});

router.post('/add', async (req, res)=>{
    
    /*
    const sql = "INSERT INTO address_book SET ?";
    const obj = {...req.body, created_at: new Date()};

    const [result] = await db.query(sql, [obj]);
    console.log(result);
    */
   // 會將表單資料都拿到，包括type=hidden的資料

    const sql = "INSERT INTO `address_book`(`name`, `email`, `mobile`, `birthday`, `address`, `created_at`) VALUES (?,?,?,?,?, NOW())";

    const [result] = await db.query(sql, [
        req.body.name,
        req.body.email,
        req.body.mobile,
        req.body.birthday || null,
        req.body.address,
    ]);

    output.success = !! result.affectedRows;
    output.result = result;
    res.json(output);
});

router.get('/delete/:sid', async (req, res)=>{
    const sql = "DELETE FROM address_book WHERE sid=?";
    const [result] = await db.query(sql, [req.params.sid]);
    res.redirect('/address-book/list');
});

router.get('/edit/:sid', async (req, res)=>{
    const sql = "SELECT * FROM address_book WHERE sid=?";
    const [rs] = await db.query(sql, [req.params.sid]);

    if(! rs.length){
        return res.redirect('/address-book/list');
    }

    res.render('address-book/edit', rs[0]);
});

router.post('/edit/:sid', async (req, res)=>{
    const output = {
        success: false,
        error: ''
    };

    const sql = "UPDATE `address_book` SET ? WHERE sid=?";
    const [result] = await db.query(sql, [
        req.body,
        req.params.sid
    ]);

    console.log(result);
    output.success = !! result.changedRows;
    output.result = result;

    res.json(output);
    

});



module.exports = router;