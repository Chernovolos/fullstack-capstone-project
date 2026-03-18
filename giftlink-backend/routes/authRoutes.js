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

module.exports = router;
