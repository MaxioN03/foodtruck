const ProductRoutes = require('./product_routes');
const orderRoutes = require('./order_routes');
const orderHistoryRoutes = require('./order_history_routes');
const utilRoutes = require('./util');

module.exports = function(app, db) {
  ProductRoutes(app, db);
  orderRoutes(app, db);
  orderHistoryRoutes(app, db);
  utilRoutes(app, db);
};