import productService from "../services/product.service.js";

class ProductController {
  getAll(req, res) {
    res.status(200).json(productService.getAll());
  }

  getById(req, res) {
    const id = Number(req.params.id);
    const product = productService.getById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  }

  create(req, res) {
    const { name, price } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ message: "name and price are required" });
    }

    const product = productService.create({ name, price });
    return res.status(201).json(product);
  }

  update(req, res) {
    const id = Number(req.params.id);
    const product = productService.update(id, req.body);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  }

  delete(req, res) {
    const id = Number(req.params.id);
    const deleted = productService.delete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  }
}

export default new ProductController();
