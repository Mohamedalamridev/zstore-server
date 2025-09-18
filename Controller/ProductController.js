const ProductModel = require("../Models/ProductModel");

module.exports.createProduct = async (req, res) => {
  try {
    const newProduct = new ProductModel({
      ...req.body,
    });

    await newProduct.save();
    return res
      .status(201)
      .json({ newProduct, message: "Product created successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports.getProducts = async (req, res) => {
  try {
    const products = await ProductModel.find();

    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.getOneById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await ProductModel.findById({ _id: id });
    if (product) {
      return res.status(200).json({ product });
    }
    return res.status(404).json({ message: "product not found" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.deleteOneById = async (req, res) => {
  const { id } = req.params;
  try {
    await ProductModel.findByIdAndDelete(id);

    return res.status(404).json({ message: "product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.findByIdAndUpdate = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await ProductModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }

    return res.status(200).json({ product });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
