const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const OrdersController = require('../controller/orders');

router.get("/", checkAuth, OrdersController.orders_get_all_orders);

router.post("/", checkAuth, OrdersController.orders_create_order);

router.get("/:orderId", checkAuth, OrdersController.orders_get_order_by_id);

router.delete("/:orderId", checkAuth, OrdersController.orders_delete_order_by_id);

module.exports = router;
