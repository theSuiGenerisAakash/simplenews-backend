import httpStatus from "http-status";

const isSameUser = async (req, res, next) => {
    if ([req.body.id, req.params.id].includes(req.user.id)) {
        return next();
    }
    return res.status(httpStatus.FORBIDDEN).send("Request for another user is not allowed");
};

export default isSameUser;
