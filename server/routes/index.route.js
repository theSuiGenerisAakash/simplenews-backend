import express from "express";
import authRoutes from "./auth.route";
import adminRoutes from "./admin.route";
import userRoutes from "./user.route";
import newsRoutes from "./news.route";
import isAdmin from "../helpers/adminUtil";

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get("/health-check", (req, res) => res.send("OK"));

router.use("/auth", authRoutes);

router.use("/users", userRoutes);

router.use("/admin", isAdmin, adminRoutes);

router.use("/news", newsRoutes);

export default router;
