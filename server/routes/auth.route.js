import express from "express";
import { ev, validationRules } from "../../config/joi-validation";
import authCtrl from "../controllers/auth.controller";

const router = express.Router(); // eslint-disable-line new-cap

/**
 * POST /api/auth/login - Returns token if correct username and password is provided
 */
router.route("/login").post(ev(validationRules.login), authCtrl.login);

export default router;
