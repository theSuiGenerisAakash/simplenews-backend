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
    return db.Users.getUserByUsernameOrId(reqUsername)
        .then((user) => {
            if (!user) {
                throw Error("User not found");
            }
            const { username, id, name } = user.dataValues;
            if (user.isValidPassword.call(user, reqPassword)) {
                const token = jwt.sign(
                    {
                        username,
                        id
                    },
                    config.jwtSecret,
                    {
                        expiresIn: 3600
                    }
                );
                return res.json({
                    token,
                    username,
                    name
                });
            }
            throw Error();
        })
        .catch((err) => catchClause(err, next, err.message, httpStatus.FORBIDDEN));
}

export default { login };
