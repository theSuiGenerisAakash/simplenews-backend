import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compress from "compression";
import methodOverride from "method-override";
import cors from "cors";
import httpStatus from "http-status";
import expressJwt from "express-jwt";
import expressWinston from "express-winston";
import expressValidation from "express-validation";
import helmet from "helmet";
import config from "./config";
import logger from "./winston/get-default-logger";
import routes from "../server/routes/index.route";
import APIError from "../server/helpers/APIError";

// Define default HTTP logger instance (use default logger instance)
const winstonInstance = logger;

const app = express();

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// This is really just a test output and should be the first thing you see
winstonInstance.info("The application is starting...");

// enable detailed API logging in dev env
if (config.env === "development") {
    expressWinston.requestWhitelist.push("body");
    expressWinston.responseWhitelist.push("body");
    app.use(
        expressWinston.logger({
            winstonInstance,
            meta: true, // optional: log meta data about request (defaults to true)
            msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
            colorStatus: true // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
        })
    );
}

// Get API Version from .env (or else assume 1.0)
const baseUrl = `/api/v${config.apiVersion}`;

// check for authentication for all routes to be mounted except for login and health-check
app.use(
    expressJwt({ secret: config.jwtSecret }).unless({
        path: [`${baseUrl}/auth/login`, `${baseUrl}/health-check`, `${baseUrl}/users/new-user`]
    })
);

// mount all routes on /api path
app.use(`${baseUrl}`, routes);

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
    if (err instanceof expressValidation.ValidationError) {
        // validation error contains errors which is an array of error each containing message[]
        const unifiedErrorMessage = err.errors
            .map((error) => error.messages.join(". "))
            .join(" and ");
        const error = new APIError(unifiedErrorMessage, err.status, true);
        return res.status(error.status).send({ message: error.message });
    }
    // if error is not an instanceOf APIError, convert it.
    const apiError = new APIError(err.message, err.status, err.isPublic);
    if (apiError.isPublic) {
        return next(apiError);
    }
    return res.status(apiError.status).send({ message: apiError.message });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new APIError("API not found", httpStatus.NOT_FOUND);
    return next(err);
});

// log error in winston transports except when executing test suite
if (config.env !== "test") {
    app.use(
        expressWinston.errorLogger({
            winstonInstance
        })
    );
}

// error handler, send stacktrace only during development
app.use((err, req, res) =>
    res.status(err.status).json({
        // eslint-disable-line no-unused-vars
        message: err.isPublic ? err.message : httpStatus[err.status],
        stack: config.env === "development" ? err.stack : {}
    })
);

export default app;
