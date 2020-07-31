/* eslint-env jest */

import request from "supertest";
import httpStatus from "http-status";
import app from "../../index";
import config from "../../config/config";
import db from "../../config/sequelize";
import authHelper from "./helpers/authHelper";

const apiVersionPath = `/api/v${config.apiVersion}`;

describe("## User APIs", () => {
    let testApp;
    let testUserToken;
    let anotherTestUserToken;
    const testUser = {
        username: "test",
        password: "passw0rd",
        name: "test"
    };
    const anotherTestUser = {
        username: "test2",
        password: "passw0rd",
        name: "test2"
    };

    beforeAll(async () => {
        testApp = request(app);
        await db.Users.truncate({ force: true })
            .then(() => db.Users.createUsers([testUser, anotherTestUser]))
            .then((createdUsers) => {
                testUser.id = createdUsers[0].id;
                anotherTestUser.id = createdUsers[1].id;
            });
        testUserToken = `Bearer ${await authHelper(testApp, testUser)}`;
        anotherTestUserToken = `Bearer ${await authHelper(testApp, anotherTestUser)}`;
    });

    afterAll(async () => {
        await db.Users.truncate({ force: true });
        await db.sequelize.close();
    });

    describe(`# GET ${apiVersionPath}/users/:userId`, () => {
        test("should get user details", (done) => {
            testApp
                .get(`${apiVersionPath}/users/${testUser.id}`)
                .set("Authorization", testUserToken)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.username).toEqual(testUser.username);
                    done();
                })
                .catch(done);
        });
    });

    describe(`# PUT ${apiVersionPath}/users`, () => {
        beforeAll(() => {
            testUser.name = "changedName";
        });
        afterAll(() => {
            testUser.name = "test";
        });
        test("should update user details", (done) => {
            testApp
                .put(`${apiVersionPath}/users`)
                .set("Authorization", testUserToken)
                .send(testUser)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body[0].name).toEqual(testUser.name);
                    done();
                })
                .catch(done);
        });

        test("should fail in case other user's token is used", (done) => {
            testApp
                .put(`${apiVersionPath}/users`)
                .set("Authorization", anotherTestUserToken)
                .send(testUser)
                .expect(httpStatus.FORBIDDEN)
                .then((res) => {
                    expect(res.text).toEqual("Request for another user is not allowed");
                    done();
                })
                .catch(done);
        });
    });
});
