const express = require('express');
const router = express.Router();

router.use((req, res, next)=>{
    res.locals.amy += ' admin2';
    next();
});



router.get('/admin2/:p1?/:p2?',(req,res) => {
    let {
        params,
        url,  //router內的url
        baseUrl, //主程式的url
        originalUrl //baseurl + url 組成
    } = req;

    res.json({
        params,
        url,  
        baseUrl, 
        originalUrl,
        "res.locals.amy": res.locals.amy
    });
})

// router.get('/', (req,res) => {
//     res.json("ya!");
// })

module.exports = router;