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
 * Get user
 * @property {string} req.params.id
 * @returns {User}
 */
function get(req, res, next) {
    const {
        params: { id }
    } = req;
    return Users.getUserById(id)
        .then((user) => {
            if (user) {
                return res.status(httpStatus.OK).send(user);
            }
            return res.status(httpStatus.NOT_FOUND).send("User not found");
        })
        .catch((err) => catchClause(err, next, "User fetch failed"));
}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.name - The name of user.
 * @property {string} req.body.password - The password of user.
 * @property {string} req.body.id - user's id
 * @returns {User}
 */
function update(req, res, next) {
    const {
        body: { username, password, name, id }
    } = req;
    return Users.updateUser({ username, password, name, id })
        .then((updatedUser) => {
            if (updatedUser) {
                return res.status(httpStatus.OK).send(updatedUser);
            }
            return res.status(httpStatus.NOT_FOUND);
        })
        .catch((err) => catchClause(err, next, "User details couldn't be updated"));
}

export default {
    get,
    update
};
