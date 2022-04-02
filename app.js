const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const morgan = require("morgan");
/*Load Config */
dotenv.config({ path: "./config/config.env" });
/*Connect DB */
connectDB();
/*Initialize App */
const app = express();
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
/*Define Ports */
const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);