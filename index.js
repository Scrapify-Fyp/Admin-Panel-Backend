const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/config");

const port = 3002;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // Allow credentials (cookies)
  })
);
app.use(cookieParser());

//all the routes.
const userRouter = require("./controllers/userController");
const productRouter = require("./controllers/productController");
const authRouter = require("./controllers/authController");
const shopRouter = require("./controllers/shopController");
const authMiddleware = require("./service/jwtAuth");

app.get("/", (req, res) => {
  res.send("The sever is running and this is the home route");
});

app.get("/profile", authMiddleware, (req, res) => {
  const userID = req.user.id;

  res.json(userID);
});
app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.use("/", authRouter);
app.use("/", productRouter);
app.use("/", userRouter);
app.use("/", shopRouter);

try {
  connectDB();
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
} catch (error) {
  console.log(error);
}
