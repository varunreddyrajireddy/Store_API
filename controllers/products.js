const productModel = require("../models/products");

const getProductsStatic = async (req, res) => {
  const products = await productModel.find({});
  return res.status(200).json({ nbHits: products.length, products });
};

const getProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  queryProducts = {};

  if (featured) {
    queryProducts.featured = featured;
  }
  if (company) {
    queryProducts.company = company;
  }
  if (name) {
    queryProducts.name = { $regex: name, $options: "i" };
  }
  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<=": "$lte",
      "<": "$lt",
    };

    const regEx = /\b(<|>|<=|=|>=)\b/g;

    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );

    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryProducts[field] = { [operator]: Number(value) };
      }
    });
  }
  let result = productModel.find(queryProducts);
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }

  if (fields) {
    const fieldList = fields.split(",").join(" ");
    result = result.select(fieldList);
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const products = await result;
  return res.status(200).json({ nbHits: products.length, products });
};

module.exports = {
  getProducts,
  getProductsStatic,
};
