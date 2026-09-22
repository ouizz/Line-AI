import { Router } from "express";

import {
  handleLineWebhook
} from "../controllers/line.controller.js";

const router = Router();

router.post(
  "/webhook",
  handleLineWebhook
);

export default router;