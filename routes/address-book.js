const express = require('express');
const db = require('./../modules/connect-db');

const router = express.Router();

async function getListData(req, res){
    const perPage = 5; // 每一頁最多幾筆
    // 用戶要看第幾頁
    let page = req.query.page ? parseInt(req.query.page) : 1;
    if(page<1){
        return res.redirect('/address-book/list');
    }

    
    const output = {
        perPage,
        page,
        totalRows: 0,
        totalPages: 0,
        rows: []
    };

    const t_sql = "SELECT COUNT(1) num FROM address_book";
    const [rs1] = await db.query(t_sql);
    const totalRows = rs1[0].num;
    let totalPages = 0;
    if(totalRows){
        output.totalRows = totalRows;
        output.totalPages = Math.ceil(totalRows/perPage);
        if(page > output.totalPages){
            return res.redirect(`/address-book/list?page=${output.totalPages}`)
        }

        const sql = `SELECT * FROM \`address_book\` LIMIT ${perPage*page-1}, ${perPage}`;
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


module.exports = router;