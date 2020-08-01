import httpStatus from "http-status";

const isAdmin = async (req, res, next) => {
    if (req.user.isAdmin !== "false") {
        return next();
    }
    return res.status(httpStatus.FORBIDDEN).send("Not an admin");
};

export default isAdmin;
