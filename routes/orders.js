var express = require('express');
var router = express.Router();

var OrderModel = require('../models/order');

//Place an order
router.post('/placeOrder', function (req, res, next) {

    try {
        var dishName = req.body.dishName.toLowerCase();
        var dishQuantity = req.body.dishQuantity;
        var dishObject = {dishName: dishName, dishQuantity: dishQuantity}

        if (dishName && dishQuantity && !isNaN(dishQuantity)) {
            OrderModel.addOrUpdateOrder({'dishName': dishName}, {dishObject}).then(function (orderDoc) {
                if (orderDoc) {
                    res.send({status: 200, message: "order placed successfully", order: orderDoc})
                    io.emit("placeOrder", {order: orderDoc})
                }
                else {
                    res.send({status: 500, message: "could not place the order"})
                }
            }).catch(function (err) {
                res.send({status: 500, message: err.message})
            })
        }
        else {
            res.send({status: 500, message: "please send  valid data"})
        }
    } catch (e) {
        res.send({status: 500, message: e.message})
    }
});

//Place an order
router.post('/updateOrderProperties', function (req, res, next) {
    try { //Check if predicted request paramter is a number
        if (isNaN(req.body.predictedQuantity)) {
            res.send({status: 500, message: "Please send a valid number"})
        }
        else {
            var predictedQuantity = req.body.predictedQuantity;

            try {
                var dishName = req.body.dishName.toLowerCase()
                var dishObject = {predictedQuantity: predictedQuantity}
                OrderModel.updateOrder({'dishName': dishName}, {dishObject}).then(function (orderDoc) {
                    if (orderDoc) {
                        res.send({status: 200, message: "updated", order: orderDoc})
                        io.emit("placeOrder", {order: orderDoc})
                    }
                    else {
                        res.send({status: 500, message: "could not place the order"})

                    }

                }).catch(function (err) {
                    res.send({status: 500, message: err.message})

                })
            } catch (e) {
                res.send({status: 500, message: "Please send a valid dish name"})
            }

        }
    } catch (e) {
        res.send({status: 500, message: e.message})
    }

});

//Place an order
router.post('/completeAnOrder', function (req, res, next) {

    try {
        var dishName = req.body.dishName.toLowerCase()

        //Get the dishName above and use it as a condition to look up for an existing dish
        OrderModel.completeOrder({'dishName': dishName}).then(function (orderDoc) {
            if (orderDoc) {
                res.send({status: 200, message: "completed the order", order: orderDoc})
                io.emit("placeOrder", {order: orderDoc})
            }
            else {
                res.send({status: 500, message: "could not complete the order"})
            }
        }).catch(function (err) {
            res.send({status: 200, message: err.message})
        })
    } catch (e) {
        res.send({status: 500, message: ""})
    }


});
module.exports = router;
