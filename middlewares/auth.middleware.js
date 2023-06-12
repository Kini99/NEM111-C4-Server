const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.secret);
            if (decoded) {
                req.body.userId = decoded.userId;
                req.body.user = decoded.user;
                next();
            }
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    } else {
        res.status(500).json({ msg: "Please Login!" })
    }
}

module.exports = {
    auth
}