/**
 * BookmarkedNews Schema
 */
import { modelOptions, timeFields } from "../helpers/modelsOptionsHelper";

module.exports = (sequelize, DataTypes) => {
    const BookmarkedNews = sequelize.define(
        "BookmarkedNews",
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: sequelize.literal("uuid_generate_v4()"),
                primaryKey: true
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
                unique: "composite_key_userId_newsId"
            },
            newsId: {
                type: DataTypes.UUID,
                allowNull: false,
                unique: "composite_key_userId_newsId"
            },
            ...timeFields
        },
        {
            ...modelOptions(),
            tableName: "bookmarked_news",
            classMethods: {
                associate(models) {
                    BookmarkedNews.belongsTo(models.Users, {
                        foreignKey: "id",
                        as: "fk_bookmarkednews_user"
                    });
                    BookmarkedNews.belongsTo(models.News, {
                        foreignKey: "id",
                        as: "fk_bookmarkednews_news"
                    });
                }
            }
        }
    );

    BookmarkedNews.getBookmarkedNewsForUser = async (userId) => {
        return BookmarkedNews.findAll({
            where: {
                userId
            }
        });
    };

    BookmarkedNews.createBookmark = async (userId, newsId) => {
        const isAlreadyPresent = await BookmarkedNews.findOne({
            where: { userId, newsId },
            paranoid: false
        });
        if (isAlreadyPresent) {
            return isAlreadyPresent.restore();
        }
        return BookmarkedNews.findOrCreate({
            where: {
                userId,
                newsId
            }
        });
    };

    BookmarkedNews.removeBookmark = async (userId, newsId) => {
        return BookmarkedNews.destroy({ where: { userId, newsId } });
    };

    return BookmarkedNews;
};
