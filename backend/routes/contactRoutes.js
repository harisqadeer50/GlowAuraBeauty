import express from "express";
import { body } from "express-validator";
import { sendContactMessage } from "../controllers/contactController.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("message").trim().notEmpty().withMessage("Message is required"),
  ],
  validate,
  sendContactMessage
);

export default router;