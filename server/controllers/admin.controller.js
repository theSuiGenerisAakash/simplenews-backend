import httpStatus from "http-status";
import db from "../../config/sequelize";
import catchClause from "../helpers/controllerHelpers";

const { Users } = db;

/**
 * @typedef {Object} User
 * @property {string} username
 * @property {string} name
 * @property {string} id
 * @property {boolean} isAdmin
 */

/**
 * Get a user from the system
 */
function getAll(req, res, next) {
    return Users.getAllUsers()
        .then((users) =>
            res.status(users ? httpStatus.OK : httpStatus.NO_CONTENT).json(users || [])
        )
        .catch((err) => catchClause(err, next, "Users couldn't be listed"));
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.name - The name of user.
 * @property {string} req.body.password - The password of user.
 * @property {boolean} req.body.isAdmin - is user admin?
 */
function create(req, res, next) {
    return Users.createUsers([req.body])
        .then((user) => res.status(httpStatus.CREATED).json(user[0]))
        .catch((err) => catchClause(err, next, "User could not be created"));
}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.name - The name of user.
 * @property {string} req.body.password - The password of user.
 * @property {boolean} req.body.isAdmin - is user admin?
 * @property {string} id - user's id
 * @returns {User}
 */
function update(req, res, next) {
    const user = req.body;
    return Users.updateUser(user)
        .then((updatedUser) => {
            if (updatedUser) {
                return res.status(httpStatus.OK).send(updatedUser);
            }
            return res.status(httpStatus.NOT_FOUND).send("User not found");
        })
        .catch((err) => catchClause(err, next, "User details couldn't be updated"));
}

/**
 * Delete user.
 * @property {string} req.body.id
 */
function remove(req, res, next) {
    return Users.deleteUsers([req.body])
        .then((deletedUser) =>
            res
                .status(deletedUser ? httpStatus.OK : httpStatus.NOT_FOUND)
                .send(deletedUser ? "User removed" : "User not found")
        )
        .catch((err) => catchClause(err, next, "User deletion failed"));
}

export default {
    create,
    getAll,
    remove,
    update
};
