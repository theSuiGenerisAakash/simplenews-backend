/* eslint-env jest */

import request from "supertest";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import app from "../../index";
import config from "../../config/config";
import db from "../../config/sequelize";
import { seed, unseed } from "./seeds";

const apiVersionPath = `/api/v${config.apiVersion}`;

describe("## Auth API", () => {
    let testApp;

    beforeAll(async () => {
        await seed(db);
        testApp = request(app);
    });

    afterAll(async (done) => {
        await unseed(db);
        db.sequelize.close(done);
    });

    const validUserCredentials = {
        username: "AakashV",
        password: "P@ssw0rd"
    };

    const invalidUserPassword = {
        username: "AakashV",
        password: "IDontKnow"
    };

    const invalidUser = {
        username: "xxxx",
        password: "IDontKnow"
    };

    let jwtToken;

    describe(`# POST ${apiVersionPath}/auth/login`, () => {
        test("should return Authentication error", (done) => {
            testApp
                .post(`${apiVersionPath}/auth/login`)
                .send(invalidUserPassword)
                .expect(httpStatus.UNAUTHORIZED)
                .then((res) => {
                    expect(res.body.message).toEqual("Authentication error");
                    done();
                })
                .catch(done);
        });

        test("should return User not found error", (done) => {
            testApp
                .post(`${apiVersionPath}/auth/login`)
                .send(invalidUser)
                .expect(httpStatus.NOT_FOUND)
                .then((res) => {
                    expect(res.body.message).toEqual("User not found");
                    done();
                })
                .catch(done);
        });

        test("should get valid JWT token", (done) => {
            testApp
                .post(`${apiVersionPath}/auth/login`)
                .send(validUserCredentials)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body).toHaveProperty("token");
                    jwt.verify(res.body.token, config.jwtSecret, (err, decoded) => {
                        expect(!err);
                        expect(decoded.username).toEqual(validUserCredentials.username);
                        jwtToken = `Bearer ${res.body.token}`;
                        done();
                    });
                })
                .catch(done);
        });
    });

    describe(`# Authentication-dependant APIs`, () => {
        test("should fail to get news because of missing Authorization", (done) => {
            testApp
                .post(`${apiVersionPath}/news`)
                .expect(httpStatus.UNAUTHORIZED)
                .then((res) => {
                    expect(res.body.message).toEqual("No authorization token was found");
                    done();
                })
                .catch(done);
        });

        test("should fail to get news because of wrong token", (done) => {
            testApp
                .post(`${apiVersionPath}/news`)
                .set(
                    "Authorization",
                    "Bearer ieyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFha2FzaFZlcm1hMSIsImlkIjoiNTZiOWMzYzQtMGQzNy00ZmI5LWEyMjctOWIyOWNkNzZkNjA1IiwiaXNBZG1pbiI6InRydWUiLCJpYXQiOjE1OTU3ODM3NzksImV4cCI6MTU5NjY0Nzc3OX0.qC9deHHytLYIe4f0oxb7R-1PseAd5VMQ1t5XGLpHLIY"
                )
                .expect(httpStatus.UNAUTHORIZED)
                .then((res) => {
                    expect(res.body.message).toEqual("invalid token");
                    done();
                })
                .catch(done);
        });
    });
});
