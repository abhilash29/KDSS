var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new mongoose.Schema({
    dishName: String,
    dishQuantity: {type: Number, default: 0},
    createdUntilNow: {type: Number, default: 0},
    predictedQuantity: {type: Number, default: 0},
    isPrepared: Boolean,
});
orderSchema.statics.addOrUpdateOrder = function (condition, arg) {
    const model = this;
    const options = {upsert: true, new: true, setDefaultsOnInsert: true};
    return new Promise(function (resolve, reject) {

        model.findOne(condition, function (err, result) {
            if (err) {
                Logger.err("Unable to place order" + err);
            } else {


                var obtainedDishQuantity = Number(arg.dishObject.dishQuantity);
                var totalDishQuantity, storedDishQuantity = 0;
                var isInserted;
                if (result) {
                    isInserted = false;
                    try {
                        storedDishQuantity = Number(result.dishQuantity)
                    } catch (e) {
                    }
                }
                else {
                    isInserted = true;
                }
                totalDishQuantity = obtainedDishQuantity + storedDishQuantity
                const options = {upsert: true, new: true, setDefaultsOnInsert: true};
                model.findOneAndUpdate(condition, {
                    $set: {
                        dishName: arg.dishObject.dishName,
                        dishQuantity: totalDishQuantity,
                    }
                }, options, function (err, doc) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve({orderData: doc, isInserted: isInserted})
                    }
                });


            }
        });
    })
};
orderSchema.statics.updateOrder = function (condition, arg) {
    const model = this;
    const options = {upsert: true, new: true, setDefaultsOnInsert: true};
    return new Promise(function (resolve, reject) {
        model.findOne(condition, function (err, result) {
            if (err) {
                Logger.err("Unable to complete the order" + err);
            } else {
                if (result) {
                    model.findOneAndUpdate(condition, {
                        $set: {
                            predictedQuantity: arg.dishObject.predictedQuantity,
                        }
                    }, options, function (err, doc) {
                        if (err) {
                            reject(err)
                        } else {
                            resolve({orderData: doc})
                        }
                    });
                }
                else {
                    reject("Item not found")
                }


            }
        });
    })
};
orderSchema.statics.completeOrder = function (condition) {
    const model = this;
    const options = {upsert: true, new: true, setDefaultsOnInsert: true};
    return new Promise(function (resolve, reject) {
        model.findOne(condition, function (err, result) {
            if (err) {
                Logger.err("Unable to complete the order" + err);
            } else {
                var createdUntilNow = Number(result.createdUntilNow) + 1
                model.findOneAndUpdate(condition, {
                    $set: {

                        createdUntilNow: createdUntilNow,
                    }
                }, options, function (err, doc) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve({orderData: doc})
                    }
                });


            }
        });
    })
};

orderSchema.statics.getAllOrders = function (condition, arg) {
    const model = this;
    const options = {upsert: true, new: true, setDefaultsOnInsert: true};
    return new Promise(function (resolve, reject) {
        model.find({}, function (err, docs) {
            if (!err) {
                resolve(docs)
            }
            else {
                reject(err)
            }
        });
    })
};

var orderModel = mongoose.model('Orders', orderSchema);
module.exports = orderModel;