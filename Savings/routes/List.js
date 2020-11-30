var pg = require('pg');
var conn = require('../Connection/connection');
var pool = new pg.Pool(conn);
var router = require('express').Router();

var userMiddleware = require("../middlewares/getUserDataMiddleware");

router.get('/earning', userMiddleware.getUserData, (req,res) => {
    console.log("GET")
    pool.query('select * from Notes inner join Items on Notes.id = Items.note_id where Notes.e_or_c=\'Earning\'')
        .then(result=> {
            res.json({
                earning: result.rows
            });
        })
        .catch(err=>{
            console.log(err);
        })
});

router.delete('/:id', (req,res,next) => {
    console.log("DELETE")
    pool.query('delete from items where id=$1',[req.params.id])
        .then(resp => {
            res.json(resp.rows[0]).status(200)
        })
        .catch(err => {
            console.log(err)
        })
});


router.post('/earning', userMiddleware.getUserData, (req,res,next) => {
    console.log(req.userId)
    pool.query('select id from notes where userid = $1 and e_or_c = \'Earning\'', [req.userId])
            .then(result => {
                pool.query("insert into items(note_id,name,amount) values($1, $2, $3) returning *", [result.rows[0].id, req.body.name, req.body.amount])
                    .then(resp => {
                        res.json(resp.rows[0]).status(200)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
            .catch(err => {
                console.log(err)
            })
    }
);


router.post('/consumtion', userMiddleware.getUserData, (req,res,next) => {
        pool.query('select id from notes where userid = $1 and e_or_c = \'Consumption\'', [req.userId])
            .then(result => {
                pool.query("insert into items(note_id,name,amount) values($1, $2, $3) returning *", [result.rows[0].id, req.body.name, req.body.amount])
                    .then(resp => {
                        res.json(resp.rows[0]).status(200)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
            .catch(err => {
                console.log(err)
            })
        }
);

router.get('/consumption', (req,res) => {
    pool.query('select * from Notes inner join Items on Notes.id = Items.note_id where Notes.e_or_c=\'Consumption\'')
        .then(result=> {
            res.json({
                consumptions: result.rows
            });
        })
        .catch(err=>{
            console.log(err);
        })
});

module.exports = router;