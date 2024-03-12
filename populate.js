require("dotenv").config();
const productModel = require("./models/products");
const jsonProducts = require("./products.json");
const connectDB = require("./db/connect");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await productModel.deleteMany();
    await productModel.create(jsonProducts);
    console.log("DB update Success");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
