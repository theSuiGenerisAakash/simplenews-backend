import Sequelize from "sequelize";
import config from "../../config/config";

export const modelOptions = (
    timestamps = true,
    paranoid = true,
    underscored = true,
    freezeTableName = true
) => ({
    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps,

    // don't delete database entries but set the newly added attribute deletedAt
    // to the current date (when deletion was done). paranoid will only work if
    // timestamps are enabled
    paranoid,

    // don't use camelcase for automatically added attributes but underscore style
    // so updatedAt will be updated_at
    underscored,

    // disable the modification of tablenames; By default, sequelize will automatically
    // transform all passed model names (first parameter of define) into plural.
    // if you don't want that, set the following
    freezeTableName,

    schema: config.schema
});

export const timeFields = {
    createdAt: { type: Sequelize.DATE, field: "created_at", defaultValue: Sequelize.fn("NOW") },
    updatedAt: { type: Sequelize.DATE, field: "updated_at", defaultValue: Sequelize.fn("NOW") },
    deletedAt: { type: Sequelize.DATE, field: "deleted_at" }
};
