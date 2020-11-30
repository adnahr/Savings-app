var jwt = require("jsonwebtoken");

module.exports = {
    getUserData: (req, res, next) => {
        let token = req.headers['authorization'].split(" ")[1];
        try {
            let t = jwt.verify(token, "privateKey");

            console.log(t);
            req.userId = t.id;
            next();
        } catch(err) {
            res.sendStatus(401);
        }
    }
}