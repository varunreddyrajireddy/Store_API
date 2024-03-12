require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");
const connectDB = require("./db/connect");
const productsRouter = require("./routes/products");

app.use(express.json());

app.get("/", (req, res) => {
  res.send('<h1>Store API</h1><a href="/api/v1/products">Products</a>');
});

app.use("/api/v1/products", productsRouter);

app.use(errorHandler);
app.use(notFound);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
