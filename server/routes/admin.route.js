import express from "express";
import validate from "express-validation";
import reqValidation from "../../config/joi-validation";
import adminCtrl from "../controllers/admin.controller";
import userCtrl from "../controllers/user.controller";

const router = express.Router({ mergeParams: true }); // eslint-disable-line new-cap

/**
 * Admin API routes
 */

router
    .route("/users/:id")

    /** GET /api/users/:userId - Get user */
    .get(validate(reqValidation.getUser), userCtrl.get);

router
    .route("/users")

    /** GET /api/users/ - Get all users */
    .get(adminCtrl.getAll)

    /** POST /api/users - Create new user */
    .post(validate(reqValidation.createUser), adminCtrl.create)

    /** PUT /api/users/:userId - Update user */
    .put(validate(reqValidation.updateAdmin), adminCtrl.update)

    /** DELETE /api/users/:userId - Delete user */
    .delete(validate(reqValidation.deleteUser), adminCtrl.remove);

export default router;
