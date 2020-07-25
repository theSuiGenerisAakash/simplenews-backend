import logger from "./config/winston";
import config from "./config/config";
import app from "./config/express";

// make bluebird default Promise
// eslint-disable-next-line no-global-assign
Promise = require("bluebird");

// module.parent check is required to support mocha watch
if (!module.parent) {
    // listen on port config.port
    app.listen(config.port, () => {
        logger.info(`The application has started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
    });
}

export default app;
