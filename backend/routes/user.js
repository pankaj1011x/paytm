import express from "express";
import { signupSchema } from "./types";
import { signinSchema } from "./types";
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

  const user = await User.create({
    username: payload.username,
    password: payload.password,
    firstName: payload.firstName,
    lastName: payload.lastName,
  });

  const userId = user._id;

  const token = jwt.sign(
    {
      userId,
    },
    JWT_SECRET
  );

  res.json({
    msg: "User created successfully",
    token: token,
  });
});

router.post("/signin", async (req, res) => {
  const payload = req.body;
  const { success } = signinSchema.safeParse(payload);
  if (!success) {
    return res.status(411).json({
      msg: "Invalid inputs",
    });
  }

  const user = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });
  if (user) {
    const token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET
    );
    res.json({
      token: token,
    });
    return;
  }

  res.status(411).json({
    msg: "Error while logging in",
  });
});
