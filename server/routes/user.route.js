import express from "express";
import validate from "express-validation";
import reqValidation from "../../config/joi-validation";
import userCtrl from "../controllers/user.controller";
import isSameUser from "../helpers/userUtil";

const router = express.Router(); // eslint-disable-line new-cap

router
    .route("/:id")

    /** GET /api/users/:userId - Get user */
    .get(validate(reqValidation.getUser), isSameUser, userCtrl.get);

router
    .route("/")

    /** PUT /api/users/ - Update user */
    .put(validate(reqValidation.updateUser), isSameUser, userCtrl.update);

export default router;
