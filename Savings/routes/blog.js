var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var pg = require('pg');
var conn = require('../Connection/connection');
var pool = new pg.Pool(conn);
var encrypt = require("../Connection/Encrypt");


router.get('/', (req,res) => {
    pool.query('select * from Blogs')
        .then(result=> {
            res.json({
                blogs: result.rows
            })
        })
        .catch(err=>{
            console.log(err);
        })
});


router.post('/addBlog',(req,res,next)=> {
    let token = req.headers['authorization'].split(" ")[1];
    let t = jwt.verify(token, "privateKey");
    console.log(t)
    if(t.id != 1) return res.sendStatus(401);
    pool.query('insert into Blogs(user_id,title,blog_text) values ($1,$2, $3)',
        [1,req.body.title, req.body.blog_text])
        .then(result=>{
            res.sendStatus(201);
        })
        .catch(err=>{
            console.log(err);
            res.sendStatus(400);
        })
})




module.exports = router;