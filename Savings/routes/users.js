var express = require('express');
var router = express.Router();
var pg = require('pg');
var conn = require('../Connection/connection');
var pool = new pg.Pool(conn);
var encrypt = require('../Connection/Encrypt');
var jwt = require('jsonwebtoken');

router.post('/login', function(req,res,next) {
  console.log(req.body);
  pool.query('select * from Users where email = $1 and pwd = $2',
      [req.body.email, encrypt.encrypt(req.body.password)],
      (err,resp) => {
      console.log(resp.rows)
        if(err) {
          console.log(err);
          return res.sendStatus(400);
        } if(resp.rows.length == 0) {
          console.log('Not successfully signined!Try again please');
          return res.sendStatus(404)
        }
          console.log(resp.rows[0]);
        let token = jwt.sign(resp.rows[0], "privateKey");
        res.json({
            token
        }).status(200)
      });
})


router.post('/register', function(req,res,next) {
  pool.query('insert into Users(name,isAdmin,email,pwd) values ($1,$2,$3,$4) returning *',
      [req.body.name,false,req.body.email, encrypt.encrypt(req.body.password)],
      (err,resp) => {
        if (err) {
          console.log(err);
          return res.sendStatus(400);
        }
        pool.query("insert into Notes(UserId, e_or_c) values ($1, 'Earning'), ($1, 'Consumption')", [resp.rows[0].id], (err, result) => {
            res.sendStatus(201);
        });
      });
})

module.exports = router;
