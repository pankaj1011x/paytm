import express from "express";

import { userRouter } from "./user.js";

import { accountRouter } from "./account.js";
import { authMiddleware } from "../middleware.js";

export const mainRouter = express.Router();

mainRouter.use("/user", userRouter);
mainRouter.use("/account", accountRouter);

mainRouter.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({
    msg: "token is valid ",
  });
});
