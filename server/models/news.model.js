/**
 * News schema
 */
import Sequelize from "sequelize";
import { modelOptions, timeFields } from "../helpers/modelsOptionsHelper";

module.exports = (sequelize, DataTypes) => {
    const News = sequelize.define(
        "News",
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: sequelize.literal("uuid_generate_v4()"),
                primaryKey: true
            },
            sourceId: {
                type: DataTypes.STRING,
                allowNull: true
            },
            sourceName: {
                type: DataTypes.STRING,
                allowNull: true
            },
            author: {
                type: DataTypes.STRING,
                allowNull: true
            },
            title: {
                type: DataTypes.STRING,
                allowNull: true
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            url: {
                type: DataTypes.TEXT,
                allowNull: true,
                unique: true
            },
            urlToImage: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            publishedAt: {
                type: DataTypes.DATE,
                allowNull: true
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            ...timeFields
        },
        {
            ...modelOptions(),
            tableName: "news",
            classMethods: {
                associate(models) {
                    // define associations
                    News.hasMany(models.BookmarkedNews, {
                        foreignKey: "newsId",
                        as: "fk_bookmarkednews_news",
                        onDelete: "CASCADE"
                    });
                }
            }
        }
    );

    News.getNewsByIds = async (newsIds) => {
        return News.findAll({
            where: {
                id: {
                    [Sequelize.Op.in]: newsIds
                }
            }
        });
    };

    News.getNewsByUrl = async (url) => {
        return News.findOne({
            where: {
                url
            }
        });
    };

    News.addNews = async (news) => {
        return News.create(news);
    };

    News.deleteNews = async (newsId) => {
        return News.destroy({
            where: {
                id: newsId
            }
        });
    };

    return News;
};
