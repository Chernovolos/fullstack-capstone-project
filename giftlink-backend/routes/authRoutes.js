const express = require("express");
const router = express.Router();
const connectToDatabase = require("../models/db");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const dotenv = require("dotenv");
const pino = require("pino");

const app = express();
const logger = pino();
const JWT_SECRET = process.env.JWT_SECRET;

dotenv.config();

router.post("/register", async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("users");

    const existingEmail = await collection.findOne({ email: req.body.email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(req.body.password, salt);
    const email = req.body.email;

    const newUser = {
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hash,
      createdAt: new Date(),
    };

    const payload = {
      user: {
        id: newUser.insertedId,
      },
    };

    const authToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    const result = await collection.insertOne(newUser);
    logger.info("User registered successfully");
    res.json({ authToken, email });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("users");
    const user = await collection.findOne({ email: req.body.email });

    if (user) {
      const passwordMatch = await bcryptjs.compare(
        req.body.password,
        user.password,
      );
      if (!passwordMatch) {
        logger.info("Invalid password");
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const payload = {
        user: {
          id: user._id.toString(),
        },
      };

      const userName = user.firstName;
      const userEmail = user.email;

      const authtoken = jwt.sign(payload, JWT_SECRET);
      logger.info("User logged in successfully");
      return res.status(200).json({ authtoken, userName, userEmail });
    } else {
      logger.error("User not found");
      return res.status(400).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/update", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error("Validation errors in update request", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const email = req.header.email;

    if (!email) {
      logger.error("Email not found in the request headers");
      return res
        .status(400)
        .json({ error: "Email not found in the request headers" });
    }

    const db = await connectToDatabase();
    const collection = db.collection("users");

    const user = await collection.findOne({ email });

    if (!user) {
      logger.error("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    user.firstName = req.body.name;
    user.updateAt = new Date();

    const updatedUser = await collection.findOneAndUpdate(
      { email },
      { $set: user },
      { returnDocument: "after" },
    );

    const payload = {
      user: {
        id: updatedUser._id.toString(),
      },
    };

    const authtoken = jwt.sign(payload, JWT_SECRET);
    logger.info("User updated successfully");

    res.json({ authtoken });
  } catch (error) {
    logger.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
