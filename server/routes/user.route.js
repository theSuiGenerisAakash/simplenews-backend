import express from "express";
import { ev, validationRules } from "../../config/joi-validation";
import userCtrl from "../controllers/user.controller";
import isSameUser from "../helpers/userUtil";

const router = express.Router(); // eslint-disable-line new-cap

router
    .route("/:id")

    /** GET /api/users/:userId - Get user */
    .get(ev(validationRules.getUser), isSameUser, userCtrl.get);

router
    .route("/")

    /** PUT /api/users/ - Update user */
    .put(ev(validationRules.updateUser), isSameUser, userCtrl.update);

export default router;
