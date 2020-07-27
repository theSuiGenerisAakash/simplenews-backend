import httpStatus from "http-status";
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
 * @property {string} [req.body.ccountry]
 * @returns {User}
 */
function getNews(req, res, next) {
    const {
        body: { search, category, country }
    } = req;

    return newsapi.v2
        .topHeadlines({
            ...(search && { q: search }),
            ...(category && { category }),
            language: "en",
            ...(country && { country })
        })
        .then((responses) => res.json(responses))
        .catch((err) => catchClause(err, next, "User fetch failed"));
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
                return News.getNewsByIds(newsIds).then((newsList) =>
                    res.json(newsList.map((news) => news.dataValues))
                );
            }
            return res.status(httpStatus.NO_CONTENT).send("No bookmarked news found");
        })
        .catch((err) => catchClause(err, next, "User details couldn't be updated"));
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
            res.status(httpStatus.CREATED).send(Array.isArray(bookmark) ? bookmark[0] : bookmark)
        );
    return News.getNewsByUrl(news.url)
        .then((newsRes) => {
            if (newsRes) {
                return saveBookmark(newsRes);
            }
            return News.addNews(news).then((addedNews) => saveBookmark(addedNews));
        })
        .catch((err) => catchClause(err, next, "User details couldn't be updated"));
}

/**
 * Remove bookmarked news of a user
 * @param {string} req.params.userId - user's id
 * @property {string} req.body.newsId - news to be bookmarked
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
                .send(removedBookmark ? "Bookmark removed" : "Bookmark not found")
        )
        .catch((err) => catchClause(err, next, "Bookmark removal failed"));
}

export default {
    getNews,
    getBookmarkedNews,
    bookmarkNews,
    removeBookmarkedNews
};
