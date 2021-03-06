import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import config from "../../config/config";
import db from "../../config/sequelize";
import catchClause from "../helpers/controllerHelpers";

/**
 * Returns jwt token and other user details if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
    const reqUsername = req.body.username;
    const reqPassword = req.body.password;
    let errStatus = "";
    return db.Users.getUserByUsername(reqUsername)
        .then((user) => {
            if (!user) {
                errStatus = httpStatus.NOT_FOUND;
                throw Error("User not found");
            }
            const { username, id, name, isAdmin } = user.dataValues;
            if (user.isValidPassword.call(user, reqPassword)) {
                const token = jwt.sign(
                    {
                        username,
                        id,
                        isAdmin
                    },
                    config.jwtSecret,
                    {
                        expiresIn: 3600 * 6
                    }
                );
                return res.json({
                    token,
                    username,
                    name,
                    isAdmin,
                    id
                });
            }
            errStatus = httpStatus.UNAUTHORIZED;
            throw Error("Authentication error");
        })
        .catch((err) => catchClause(err, next, err.message, errStatus));
}

export default { login };
