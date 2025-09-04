const express = require("express");
const app = express();
const errorMiddleware = require("./middlewares/error");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const dotenv=require("dotenv");




dotenv.config({path:path.join(__dirname,"config/config.env") });

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://127.0.0.1:5173",
    credentials: true,
  })
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const products = require("./routes/product");
const auth = require("./routes/auth");
const order = require("./routes/order");
const payments = require("./routes/payments");

app.use("/api/v1/", products);
app.use("/api/v1/", auth);
app.use("/api/v1/", order);
app.use("/api/v1/", payments);

if(process.env.NODE_ENV==="Production"){
  app.use(express.static(path.join(__dirname,"../frontend/dist")));


app.get(/.*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
});

}



app.use(errorMiddleware);
module.exports = app;
