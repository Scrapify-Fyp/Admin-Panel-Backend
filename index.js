const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/config");

const port = 3002;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const corsOptions = {
  origin: '*', 
  credentials: true, 
  optionsSuccessStatus: 200, 
};

app.use(cors(corsOptions)); 

app.use(cookieParser());

// All the routes.
const userRouter = require("./controllers/userController");
const adminRouter = require("./controllers/AdminController");
const productRouter = require("./controllers/productController");
const authRouter = require("./controllers/authController");
const shopRouter = require("./controllers/shopController");
const stripRouter = require("./controllers/stripePaymnet");
const authMiddleware = require("./service/jwtAuth");

app.get("/", (req, res) => {
  res.send("The server is running and this is the home route");
});

app.get("/profile", authMiddleware, (req, res) => {
  const userID = req.user.id;
  res.json(userID);
});

app.use("/", stripRouter);
app.use("/", authRouter);
app.use("/", productRouter);
app.use("/", userRouter);
app.use("/", adminRouter);
app.use("/", shopRouter);

try {
  connectDB();
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
} catch (error) {
  console.log(error);
}
