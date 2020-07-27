import express from "express";
import { ev, validationRules } from "../../config/joi-validation";
import newsCtrl from "../controllers/news.controller";

const router = express.Router(); // eslint-disable-line new-cap

router
    .route("/")

    /** GET /api/news/ - get news */
    .post(ev(validationRules.getNews), newsCtrl.getNews);

router
    .route("/:userId")

    /** GET /api/news/:userId - Get bookmarked news of a user */
    .get(ev(validationRules.getBookmarkedNews), newsCtrl.getBookmarkedNews)

    /** POST /api/news/ - bookmark news for user */
    .post(ev(validationRules.bookmarkNews), newsCtrl.bookmarkNews)

    /** DELETE /api/news/ - bookmark news for user */
    .delete(ev(validationRules.removeBookmarkedNews), newsCtrl.removeBookmarkedNews);

export default router;
