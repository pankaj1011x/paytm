import express from "express";
import { signupSchema } from "../types.js";
import { signinSchema } from "../types.js";
import { updateSchema } from "../types.js";
import { authMiddleware } from "../middleware.js";
import { Account } from "../db.js";
import { User } from "../db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const userRouter = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

userRouter.post("/signup", async (req, res) => {
  const payload = req.body;
  console.log(payload);
  const { success } = signupSchema.safeParse(payload);
  if (!success) {
    return res.status(411).json({
      msg: "Invalid inputs",
    });
  }
  const existingUser = await User.findOne({
    username: payload.username,
  });

  if (existingUser) {
    return res.status(411).json({
      msg: "Email already taken",
    });
  }

  try {
    const user = await User.create({
      username: payload.username,
      firstName: payload.firstName,
      lastName: payload.lastName,
      password: payload.password,
    });
    const userId = user._id;
    await Account.create({
      userId,
      balance: 1 + Math.random() * 10000,
    });
    const token = jwt.sign({ userId }, JWT_SECRET);

    res.json({ msg: "User created successfully", token });
  } catch (error) {
    res.status(500).json({ msg: "Error creating user", error });
  }
});

userRouter.post("/signin", async (req, res) => {
  const payload = req.body;

  const { success } = signinSchema.safeParse(payload);
  if (!success) {
    return res.status(400).json({ msg: "Invalid inputs" });
  }

  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res.status(401).json({ msg: "User not found" });
  }

  const isPasswordValid = await user.validatePassword(req.body.password);
  if (!isPasswordValid) {
    return res.status(401).json({ msg: "Invalid password" });
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET);

  res.json({ message: "User successfully logged in", token });
});

userRouter.put("/", authMiddleware, async (req, res) => {
  const { success } = updateSchema.safeParse(req.body);

  if (!success) {
    res.status(411).json({
      msg: "Invalid inputs",
    });
  }
  await User.updateOne({ _id: req.userId }, req.body);

  res.json({
    msg: "Updated successfully",
  });
});

userRouter.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";
  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});
