import httpStatus from "http-status";
import logger from "../../config/winston";

const catchClause = (
    err,
    next,
    message = "Something went wrong!",
    statusCode = httpStatus.INTERNAL_SERVER_ERROR
) => {
    logger.error(err);
    return next({
        message,
        status: statusCode
    });
};

export default catchClause;
