import Sequelize from "sequelize";
import fs from "fs";
import path from "path";
import _ from "lodash";
import config from "./config";
import logger from "./winston/get-default-logger";
import { seed, unseed } from "../server/tests/seeds";

const db = {};

// connect to database
const sequelizeOptions = {
    dialect: "postgres",
    port: config.postgres.port,
    host: config.postgres.host,
    schema: config.postgres.schema,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    ...(config.postgres.ssl && {
        ssl: config.postgres.ssl
    }),
    ...(config.postgres.ssl &&
        config.postgres.ssl_ca_cert && {
            dialectOptions: { ssl: { ca: config.postgres.ssl_ca_cert } }
        })
};
const sequelize = new Sequelize(
    config.postgres.db,
    config.postgres.user,
    config.postgres.passwd,
    sequelizeOptions
);

const modelsDir = path.normalize(`${__dirname}/../server/models`);

// loop through all files in models directory ignoring hidden files and this file
fs.readdirSync(modelsDir)
    .filter((file) => file.indexOf(".") !== 0 && file.indexOf(".map") === -1)
    // import model files and save model names
    .forEach((file) => {
        logger.info(`Loading model file ${file}`);
        const model = sequelize.import(path.join(modelsDir, file));
        db[model.name] = model;
    });

// Synchronizing any model changes with database.
if (config.syncDB) {
    sequelize
        .sync({ force: true })
        .then(async () => {
            logger.info("Database structure synchronized");
            if (config.env === "development") {
                return seed(db);
            }
            return Promise.resolve();
        })
        .catch(async (error) => {
            logger.error("An error occured: ", error);
            if (config.env === "development") {
                return unseed(db);
            }
            return Promise.reject();
        });
}

// assign the sequelize variables to the db object and returning the db.
module.exports = _.extend(
    {
        sequelize,
        Sequelize
    },
    db
);
