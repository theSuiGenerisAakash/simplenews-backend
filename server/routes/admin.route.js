import express from "express";
import { ev, validationRules } from "../../config/joi-validation";
import adminCtrl from "../controllers/admin.controller";
import userCtrl from "../controllers/user.controller";

const router = express.Router({ mergeParams: true }); // eslint-disable-line new-cap

/**
 * Admin API routes
 */

router
    .route("/users/:id")

    /** GET /api/users/:userId - Get user */
    .get(ev(validationRules.getUser), userCtrl.get);

router
    .route("/users")

    /** GET /api/users/ - Get all users */
    .get(adminCtrl.getAll)

    /** POST /api/users - Create new user */
    .post(ev(validationRules.createUser), adminCtrl.create)

    /** PUT /api/users/:userId - Update user */
    .put(ev(validationRules.updateAdmin), adminCtrl.update)

    /** DELETE /api/users/:userId - Delete user */
    .delete(ev(validationRules.deleteUser), adminCtrl.remove);

export default router;
