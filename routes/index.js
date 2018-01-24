var express = require('express');
var router = express.Router();
var OrderModel = require('../models/order');


/* GET home page. i.e. orders page */
router.get('/', function (req, res, next) {
    OrderModel.getAllOrders().then(function (orders) {
        res.render("index", {orders: orders})
    }).catch(function (err) {
        res.render('error', {
            message: err.message,
            status: err.status,
            stack: err.stack
        });

    })
});

module.exports = router;
