import httpStatus from "http-status";
import { uniqBy } from "lodash";
import db from "../../config/sequelize";
import catchClause from "../helpers/controllerHelpers";
import config from "../../config/config";

const NewsAPI = require("newsapi");

const newsapi = new NewsAPI(config.apiKey);

const { News, BookmarkedNews } = db;

/**
 * @typedef {Object} News
 * @property {string} id
 * @property {string} sourceId
 * @property {string} sourceName
 * @property {string} author
 * @property {string} title
 * @property {string} description
 * @property {string} url
 * @property {string} urlToImage
 * @property {string} publishedAt
 * @property {string} content
 */

/**
 * Get news
 * @property {string} [req.body.search]
 * @property {string} [req.body.category]
 * @property {string} [req.body.country]
 * @property {number} [req.body.page]
 * @returns {User}
 */
function getNews(req, res, next) {
    const {
        body: { search, category, country, page }
    } = req;

    return newsapi.v2
        .topHeadlines({
            ...(search && { q: search }),
            ...(category && { category }),
            language: "en",
            ...(country && { country }),
            page
        })
        .then((responses) =>
            res.json(
                uniqBy(
                    responses.articles.map((response) => {
                        const modRes = {
                            ...response,
                            sourceId: response.source.id,
                            sourceName: response.source.name
                        };
                        delete modRes.source;
                        return modRes;
                    }),
                    "url"
                )
            )
        )
        .catch((err) => catchClause(err, next, "News fetch failed"));
}

/**
 * Get bookmarked news for an existing user
 * @param {string} req.params.userId - user's id
 * @returns {News[]}
 */
function getBookmarkedNews(req, res, next) {
    const {
        params: { userId }
    } = req;
    return BookmarkedNews.getBookmarkedNewsForUser(userId)
        .then((bookmarks) => {
            if (bookmarks.length > 0) {
                const newsIds = bookmarks.map((bookmark) => bookmark.dataValues.newsId);
                return News.getNewsByIds(newsIds).then((newsList) => {
                    return res.json(newsList.map((news) => news.dataValues));
                });
            }
            return res.status(httpStatus.NOT_FOUND).json({ message: "No bookmarked news found" });
        })
        .catch((err) => catchClause(err, next, "Something went wrong"));
}

/**
 * Bookmark news for a user
 * @param {string} req.params.userId - user's id
 * @property {News} req.body.news - news to be bookmarked
 * @returns {BookmarkedNews}
 */
function bookmarkNews(req, res, next) {
    const {
        params: { userId },
        body: { news }
    } = req;
    const saveBookmark = (newsObj) =>
        BookmarkedNews.createBookmark(userId, newsObj.dataValues.id).then((bookmark) =>
            res.status(httpStatus.CREATED).send(newsObj.dataValues)
        );
    return News.getNewsByUrl(news.url)
        .then((newsRes) => {
            if (newsRes) {
                return saveBookmark(newsRes);
            }
            return News.addNews(news).then((addedNews) => saveBookmark(addedNews));
        })
        .catch((err) => catchClause(err, next, "News couldn't be bookmarked"));
}

/**
 * Remove bookmarked news of a user
 * @param {string} req.params.userId - user's id
 * @property {string} req.body.newsId - news to be un-bookmarked
 * @returns {string} - textual status
 */
function removeBookmarkedNews(req, res, next) {
    const {
        params: { userId },
        body: { newsId }
    } = req;
    return BookmarkedNews.removeBookmark(userId, newsId)
        .then((removedBookmark) =>
            res
                .status(removedBookmark ? httpStatus.OK : httpStatus.NOT_FOUND)
                .json({ message: removedBookmark ? "Bookmark removed" : "Bookmark not found" })
        )
        .catch((err) => catchClause(err, next, "Bookmark removal failed"));
}

export default {
    getNews,
    getBookmarkedNews,
    bookmarkNews,
    removeBookmarkedNews
};
