import express from "express";
import { signupSchema } from "./types";
import { signinSchema } from "./types";
import { updateSchema } from "./types";
import { authMiddlware } from "../middleware.js";
import { User } from "../db";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/signup", async (req, res) => {
  const payload = req.body;
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

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.json({ msg: "User created successfully", token });
  } catch (error) {
    res.status(500).json({ msg: "Error creating user", error });
  }
});

router.post("/signin", async (req, res) => {
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

router.put("/", authMiddlware, async (req, res) => {
  const { success } = updateSchema.safeParse();

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
