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

module.exports.getTopSeller = async (req, res) => {
  try {
    const topTen = await ProductModel.find().sort({ soldCount: -1 }).limit(10);

    return res.status(200).json({ products: topTen });
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
  const { id } = req.body;
  try {
    await ProductModel.findByIdAndDelete(id);

    return res.status(404).json({ message: "product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.findByIdAndUpdate = async (req, res) => {
  const { id } = req.body;
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
