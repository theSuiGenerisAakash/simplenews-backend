/* eslint-disable no-param-reassign */
/**
 * Users Schema
 */
import { Sequelize } from "sequelize";
import { modelOptions, timeFields } from "../helpers/modelsOptionsHelper";

const bcrypt = require("bcrypt");

const sanitiseAndTrim = (users) => {
    const toReturn = (user) => ({
        username: user.dataValues.username,
        name: user.dataValues.name,
        isAdmin: user.dataValues.isAdmin,
        id: user.dataValues.id
    });
    if (users === null) return users;
    if (!Array.isArray(users)) {
        return toReturn(users);
    }
    return users.map((user) => toReturn(user));
};

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
            isAdmin: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: false
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

    Users.getUserByUsername = async (username) =>
        Users.findOne({
            where: {
                username
            }
        });

    Users.getUserById = async (id) =>
        Users.findOne({
            where: {
                id
            }
        }).then(sanitiseAndTrim);

    Users.getAllUsers = async () =>
        Users.findAll().then((users) =>
            users.map((user) => {
                // eslint-disable-next-line no-param-reassign
                delete user.dataValues.password;
                return user;
            })
        );

    Users.createUsers = async (users) =>
        Users.bulkCreate(
            users.map((user) => ({ ...user, password: Users.generateHash(user.password) })),
            {
                returning: true
            }
        ).then(sanitiseAndTrim);

    Users.deleteUsers = async (users) =>
        Users.destroy({
            where: {
                id: {
                    [Sequelize.Op.in]: [users.map((user) => user.id).join(",")]
                }
            }
        });

    Users.updateUser = async (user) => {
        const userId = user.id;
        delete user.id;
        return Users.update(
            { ...user, password: Users.generateHash(user.password) },
            {
                where: {
                    id: userId
                },
                returning: true
            }
        ).then((updatedUsers) => sanitiseAndTrim(updatedUsers[1]));
    };

    return Users;
};
