const Order = require("../models/order");
const mongoose = require("mongoose");
const Product = require('../models/product');


exports.orders_get_all_orders = (req, res, next) => {
	Order.find()
		.select("_id productId quantity name")
		.populate('productId', 'name price')
    .exec()
    .then((doc) => {
      console.log(doc);
      res.status(200).json(doc);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ Error: err });
    });
}

exports.orders_create_order = (req, res, next) => {
	let orderName = '';
	Product.findById(req.body.productId).exec()
	.then(doc => {
		const order = new Order({
			_id: mongoose.Types.ObjectId(),
			productId: req.body.productId,
			quantity: req.body.quantity,
		});
		return order.save();
	})
	.then((doc) => {
		console.log(doc);
		res.status(200).json({
			message: 'Order created',
			createdOrder: {
				name: doc
			}
		});
	})
	.catch((err) => {
		console.log(err);
		res.status(500).json({ 
			message: 'Product not found',
			Error: err 
		});
	});
}

exports.orders_get_order_by_id = (req, res, next) => {
  const id = req.params.orderId;
	Order.findById(id)
		.select('_id productId quantity name')
		.populate('productId')
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ Error: err });
    });
}

exports.orders_delete_order_by_id = (req, res, next) => {
  const id = req.params.orderId;
  Order.findById(id)
    .exec()
    .then((docFind) => {
      Order.remove({ _id: id })
        .exec()
        .then((docRemove) => {
          console.log(docRemove);
          res.status(200).json({
            deletedOrder: docFind.name,
            doc: docRemove,
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ Error: err });
			  });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Order not found",
        Error: err,
      });
    });
}