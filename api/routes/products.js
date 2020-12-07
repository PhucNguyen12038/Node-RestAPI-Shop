const express = require("express");
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, './uploads/');
	},
	filename: function(req, file, cb) {
		cb(null, new Date().toISOString() + file.originalname);
	}
});

const fileFilter = (req, file, cb) => {
	// accept jpeg or png file
	if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		cb(null, true);
	}
	else{
		cb(null, false);
	}
};

const upload = multer({storage: storage, 
	limits: {
		fieldNameSize: 1024 * 1024 * 5
	},
	fileFilter: fileFilter
});

const ProductsController = require('../controller/products');
router.get("/", ProductsController.products_get_all_products);

router.post("/", checkAuth, upload.single('productImage'), ProductsController.products_create_product);

router.get("/:productId", ProductsController.products_get_product_by_id);

router.patch("/:productId", checkAuth, ProductsController.products_update_product_by_id);

router.delete("/:productId", checkAuth, ProductsController.products_delete_product_by_id);

module.exports = router;