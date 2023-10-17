const express = require("express");
const { loginPost, logout, numberVerify, passReset } = require("../controllers/login.controller");
const loginRouter = express.Router();
const upload = require("../config/multer.config");
const isLogged = require("../middlewares/isLogin");

loginRouter.get("/logout", logout);
loginRouter.post("/login", loginPost);
loginRouter.post("/numberVerify", numberVerify);
loginRouter.post("/passReset", passReset);

module.exports = loginRouter;