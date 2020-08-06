import express from "express";
import { ev, validationRules } from "../../config/joi-validation";
import userCtrl from "../controllers/user.controller";
import isSameUser from "../helpers/userUtil";
import adminCtrl from "../controllers/admin.controller";

const router = express.Router(); // eslint-disable-line new-cap

router
    .route("/:id")

    /** GET /api/users/:userId - Get user */
    .get(ev(validationRules.getUser), isSameUser, userCtrl.get);

router
    .route("/")

    /** PUT /api/users/ - Update user */
    .put(ev(validationRules.updateUser), isSameUser, userCtrl.update);

router
    .route("/new-user")
    /** POST /api/users - Create new user */
    .post(ev(validationRules.createUserPublic), adminCtrl.create);

export default router;
