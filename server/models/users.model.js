/**
 * Users Schema
 */
import { Sequelize } from "sequelize";
import { modelOptions, timeFields } from "../helpers/modelsOptionsHelper";

const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define(
        "Users",
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: sequelize.literal("uuid_generate_v4()"),
                primaryKey: true
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            ...timeFields
        },
        {
            ...modelOptions(),
            tableName: "users",
            classMethods: {
                associate(models) {
                    Users.hasMany(models.FeedbackRequests, {
                        foreignKey: "userId",
                        as: "fk_bookmarkednews_user",
                        onDelete: "CASCADE"
                    });
                }
            }
        }
    );

    Users.prototype.isValidPassword = function isValidPassword(password) {
        return bcrypt.compareSync(password, this.password);
    };

    Users.generateHash = (password) => {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
    };

    Users.getUserByUsernameOrId = async (username = undefined, id = undefined) => {
        return Users.findOne({
            where: {
                ...(username && { username }),
                ...(id && { id })
            }
        });
    };

    Users.getUsers = async (userId) => {
        return Users.findAll({
            where: {
                userId
            }
        });
    };

    Users.addUsers = async (users) => {
        return Users.bulkCreate(
            users.map((user) => ({ ...user, password: Users.generateHash(user.password) }))
        );
    };

    Users.deleteUsers = async (users) => {
        return Users.destroy({
            where: {
                username: {
                    [Sequelize.Op.in]: [users.map((user) => user.username).join(",")]
                }
            }
        });
    };

    Users.updateUser = async (username, user) => {
        const { name, password } = user;
        return Users.update(
            { name, password: Users.generateHash(password) },
            {
                where: {
                    username
                },
                returning: true
            }
        );
    };

    return Users;
};
