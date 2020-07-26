import httpStatus from "http-status";
import logger from "../../config/winston";

const catchClause = (
    err,
    next,
    message = "Something went wrong!",
    statusCode = httpStatus.INTERNAL_SERVER_ERROR
) => {
    const msgCapture = (err.errors && err.errors[0].message) || message;
    logger.error(msgCapture);
    return next({
        message: msgCapture,
        status: statusCode
    });
};

export default catchClause;
