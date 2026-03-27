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
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const registerValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Invalid email"),

  body("password")
    .isLength({ min: 8, max: 64 })
    .withMessage("Password must be 8-64 characters")
    .matches(/[A-Z]/)
    .withMessage("Must contain uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Must contain lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Must contain a number")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("Must contain special character"),

  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2, max: 50 })
    .matches(/^[a-zA-Zа-яА-ЯїЇєЄіІ0-9\s'_-]+$/)
    .withMessage("Invalid characters in first name"),

  body("lastName")
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2, max: 50 }),
];

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  next();
};

router.post(
  "/register",
  registerValidation,
  handleValidation,
  async (req, res) => {
    try {
      const db = await connectToDatabase();
      const collection = db.collection("users");

      const email = req.body.email.trim().toLowerCase();
      const firstName = req.body.firstName.trim();
      const lastName = req.body.lastName.trim();
      const password = req.body.password;

      const existingUser = await collection.findOne({ email });

      logger.warn("existingUser: %o", existingUser);
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);

      const newUser = {
        email,
        firstName,
        lastName,
        password: hashedPassword,
        createdAt: new Date(),
      };

      const result = await collection.insertOne(newUser);
      const payload = {
        user: {
          id: result.insertedId,
        },
      };

      const authToken = jwt.sign(payload, JWT_SECRET, {
        expiresIn: "1h",
      });

      logger.info("User registered successfully");
      res.json({
        authToken,
        email: req.body.email,
        firstName: req.body.firstName,
      });
    } catch (error) {
      console.error("Register error:", error.message || error);
      logger.error("Register error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").exists()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const db = await connectToDatabase();
      const collection = db.collection("users");

      const email = req.body.email.trim().toLowerCase();
      const password = req.body.password;

      const user = await collection.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const payload = {
        user: {
          id: user._id,
        },
      };

      const authToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({
        authToken,
        email: user.email,
        firstName: user.firstName,
      });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  },
);

router.put(
  "/update",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("First name is required")
      .isLength({ min: 2, max: 50 })
      .matches(/^[a-zA-Zа-яА-ЯїЇєЄіІ0-9\s'_-]+$/)
      .withMessage("Invalid characters in name"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error("Validation errors in update request", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const email = req.headers.email.trim().toLowerCase();

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

      user.firstName = req.body.name.trim();
      user.updatedAt = new Date();

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
  },
);

module.exports = router;
