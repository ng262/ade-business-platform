import express from "express";
import asyncHandler from "express-async-handler";
import multer from "multer";

import validationHandler from "@/middleware/validation.middleware";
import {
  submitContact,
  submitApplication,
} from "@/controllers/public/public.controller";
import { contactSchema, applicationSchema } from "@shared/validation";
import { multerArraySchema } from "@/validation/server.validation";

const router = express.Router();
const upload = multer();

router.post(
  "/contact",
  validationHandler({ body: contactSchema }),
  asyncHandler(submitContact)
);

router.post(
  "/apply",
  upload.array("files"),
  validationHandler({ body: applicationSchema, files: multerArraySchema }),
  asyncHandler(submitApplication)
);

router.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

const publicRouter = router;
export default publicRouter;
