"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _expressAsyncHandler = _interopRequireDefault(require("express-async-handler"));

var _utils = require("../utils");

var _productModal = _interopRequireDefault(require("../models/productModal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const productRouter = _express.default.Router();

productRouter.get('/', (0, _expressAsyncHandler.default)(async (req, res) => {
  const products = await _productModal.default.find({});
  res.send(products);
}));
productRouter.get('/:id', (0, _expressAsyncHandler.default)(async (req, res) => {
  const product = await _productModal.default.findById(req.params.id);
  res.send(product);
}));
productRouter.post('/', _utils.isAuth, _utils.isAdmin, (0, _expressAsyncHandler.default)(async (req, res) => {
  const product = new _productModal.default({
    name: 'sample product',
    description: 'sample desc',
    category: 'sample category',
    brand: 'sample brand',
    image: '/images/product-1.jpg'
  });
  const createdProduct = await product.save();

  if (createdProduct) {
    res.status(201).send({
      message: 'Product Created',
      product: createdProduct
    });
  } else {
    res.status(500).send({
      message: 'Error in creating product'
    });
  }
}));
productRouter.put('/:id', _utils.isAuth, _utils.isAdmin, (0, _expressAsyncHandler.default)(async (req, res) => {
  const productId = req.params.id;
  const product = await _productModal.default.findById(productId);

  if (product) {
    product.name = req.body.name;
    product.price = req.body.price;
    product.image = req.body.image;
    product.brand = req.body.brand;
    product.category = req.body.category;
    product.countInStock = req.body.countInStock;
    product.description = req.body.description;
    const updatedProduct = await product.save();

    if (updatedProduct) {
      res.send({
        message: 'Product Updated',
        product: updatedProduct
      });
    } else {
      res.status(500).send({
        message: 'Error in updaing product'
      });
    }
  } else {
    res.status(404).send({
      message: 'Product Not Found'
    });
  }
}));
productRouter.delete('/:id', _utils.isAuth, _utils.isAdmin, (0, _expressAsyncHandler.default)(async (req, res) => {
  const product = await _productModal.default.findById(req.params.id);

  if (product) {
    const deletedProduct = await product.remove();
    res.send({
      message: 'Product Deleted',
      product: deletedProduct
    });
  } else {
    res.status(404).send({
      message: 'Product Not Found'
    });
  }
}));
var _default = productRouter;
exports.default = _default;