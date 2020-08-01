/* eslint-env jest */

import request from "supertest";
import httpStatus from "http-status";
import app from "../../index";
import config from "../../config/config";
import db from "../../config/sequelize";
import authHelper from "./helpers/authHelper";

const apiVersionPath = `/api/v${config.apiVersion}`;

describe("## Admin APIs", () => {
    let testApp;
    let adminToken;
    let nonAdminToken;

    const admin = {
        username: "admin",
        password: "passw0rd",
        name: "admin",
        isAdmin: true
    };

    const nonAdmin = {
        username: "nonAdmin",
        password: "paswqebnjrj",
        name: "nonAdmin",
        isAdmin: false
    };

    beforeAll(async () => {
        testApp = request(app);
        await db.Users.truncate({ force: true })
            .then(() => db.Users.createUsers([admin, nonAdmin]))
            .then(async (createdUsers) => {
                admin.id = createdUsers[0].id;
                nonAdmin.id = createdUsers[1].id;
                return Promise.all([authHelper(testApp, admin), authHelper(testApp, nonAdmin)]);
            })
            .then((tokens) => {
                adminToken = `Bearer ${tokens[0]}`;
                nonAdminToken = `Bearer ${tokens[1]}`;
            });
    });

    afterAll(async () => {
        await Promise.all([
            db.Users.truncate({ force: true }),
            db.News.truncate({ force: true }),
            db.BookmarkedNews.truncate({ force: true })
        ]);
        await db.sequelize.close();
    });

    describe(`# GET ${apiVersionPath}/admin/users/:userId`, () => {
        test("should get a user", (done) => {
            testApp
                .get(`${apiVersionPath}/admin/users/${nonAdmin.id}`)
                .set("Authorization", adminToken)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.username).toEqual(nonAdmin.username);
                    done();
                })
                .catch(done);
        });

        test("should fail when accessing the API using a non-admin user's token", (done) => {
            testApp
                .get(`${apiVersionPath}/admin/users/${nonAdmin.id}`)
                .set("Authorization", nonAdminToken)
                .expect(httpStatus.FORBIDDEN)
                .then(() => {
                    done();
                })
                .catch(done);
        });
    });

    describe(`# GET ${apiVersionPath}/admin/users/`, () => {
        test("should retrieved all users", (done) => {
            testApp
                .get(`${apiVersionPath}/admin/users/`)
                .set("Authorization", adminToken)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.length).toBe(2);
                    done();
                })
                .catch(done);
        });
    });

    describe(`# DELETE ${apiVersionPath}/users/`, () => {
        afterAll(async () =>
            db.Users.findOne({ where: { id: nonAdmin.id }, paranoid: false }).then((user) => {
                return user.restore();
            })
        );
        test("should ", (done) => {
            testApp
                .delete(`${apiVersionPath}/admin/users/`)
                .set("Authorization", adminToken)
                .send({ id: nonAdmin.id })
                .expect(httpStatus.OK)
                .then(() => {
                    done();
                })
                .catch(done);
        });
    });

    describe(`# POST ${apiVersionPath}/users`, () => {
        const secondTestUser = {
            username: "test2",
            password: "passw0rd",
            name: "test2",
            isAdmin: true
        };
        afterAll(async () => db.Users.destroy({ where: { username: "test2" }, force: true }));
        test("should add a user", (done) => {
            testApp
                .post(`${apiVersionPath}/admin/users`)
                .set("Authorization", adminToken)
                .send(secondTestUser)
                .expect(httpStatus.CREATED)
                .then((res) => {
                    expect(res.body.username).toBe(secondTestUser.username);
                    done();
                })
                .catch(done);
        });
    });

    describe(`# PUT ${apiVersionPath}/users`, () => {
        nonAdmin.username = "nonAdmin_changed";
        afterAll(async () => {
            nonAdmin.username = "nonAdmin";
            return db.Users.update(nonAdmin, {
                where: { username: "nonAdmin_changed" }
            });
        });
        test("should update an added user", (done) => {
            testApp
                .put(`${apiVersionPath}/admin/users`)
                .set("Authorization", adminToken)
                .send(nonAdmin)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body[0].username).toBe("nonAdmin_changed");
                    done();
                })
                .catch(done);
        });
    });
});
