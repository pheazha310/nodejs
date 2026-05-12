import Product from "../models/product.model.js";

class ProductService {
  constructor() {
    this.products = [];
    this.nextId = 1;
  }

  getAll() {
    return this.products;
  }

  getById(id) {
    return this.products.find((product) => product.id === id);
  }

  create({ name, price }) {
    const product = new Product({
      id: this.nextId++,
      name,
      price,
    });

    this.products.push(product);
    return product;
  }

  update(id, data) {
    const product = this.getById(id);

    if (!product) {
      return null;
    }

    if (data.name !== undefined) {
      product.name = data.name;
    }

    if (data.price !== undefined) {
      product.price = data.price;
    }

    return product;
  }

  delete(id) {
    const index = this.products.findIndex((product) => product.id === id);

    if (index === -1) {
      return false;
    }

    this.products.splice(index, 1);
    return true;
  }
}

export default new ProductService();
