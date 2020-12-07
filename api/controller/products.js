const Product = require("../models/product");
const mongoose = require("mongoose");

exports.products_get_all_products = (req, res, next) => {
  Product.find()
  .select("name price _id productImage")
  .exec()
  .then(docs => {
    const response = {
      count: docs.length,
      products: docs.map(doc => {
        return {
          name: doc.name,
          price: doc.price,
					_id: doc._id,
					productImage: doc.productImage,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/' + doc._id
          }
        }
      })
    }
    console.log(docs);
    res.status(200).json(docs);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({Error: err});
  });
}

exports.products_create_product = (req, res, next) => {
	console.log(req.file);
  const product = new Product({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
		price: req.body.price,
		productImage: req.file.path
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Product is created",
        createdProduct: {
          name: result.name,
          price: result.price,
					_id: result._id,
					productImage: result.productImage,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/products/' + result._id
          }
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({Error: err});
    })
};

exports.products_get_product_by_id = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select('name price _id')
    .exec()
    .then((doc) => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: 'GET',
            description: 'Get all products',
            url: 'http://localhost:3000/products'
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "Not valid entry for the provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ Error: err });
    });
};

exports.products_update_product_by_id = (req, res, next) => {
  const id = req.params.productId;
  const updateObj = {};
  for(const upd of req.body) {
    updateObj[upd.propName] = upd.value;
  }
  Product.update({_id: id}, {$set: updateObj}).exec()
  .then(doc => {
    console.log(doc);
    res.status(200).json({
      message: 'Product updated',
      request: {
        type: 'GET',
        url: 'http://localhost:3000/products/' + id
      }
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({Error: err});
  })
};

exports.products_delete_product_by_id = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id).exec()
  .then(doc => {
    Product.remove({_id: id}).exec()
    .then(doc2 => {
      res.status(200).json({
        message: 'Product deleted',
        deletedProduct: {
          name: doc.name,
          price: doc.price
        }
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({Error: err});
    })
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
};