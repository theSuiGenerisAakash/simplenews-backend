/* eslint-env jest */

import request from "supertest";
import httpStatus from "http-status";
import app from "../../index";
import config from "../../config/config";
import db from "../../config/sequelize";
import authHelper from "./helpers/authHelper";

const apiVersionPath = `/api/v${config.apiVersion}`;

describe("## News APIs", () => {
    let testApp;
    let testUserToken;

    const testUser = {
        username: "test",
        password: "passw0rd",
        name: "test"
    };

    const getNewsBody = {
        search: "Indonesia"
    };

    const postNewsBody = {
        news: {
            sourceId: "national-geographic",
            sourceName: "National Geographic",
            author: "Susan Ager",
            title: "Tragic photos can change the course of history—but not always",
            description:
                "A picture of a COVID-19 victim is galvanizing conversation in Indonesia. Will it lead to lasting change?",
            url:
                "https://www.nationalgeographic.com/photography/2020/07/can-tragic-pictures-change-history.html",
            urlToImage:
                "https://www.nationalgeographic.com/content/dam/archaeologyandhistory/2020/07/indonesia-photography-ethics/01-indonesia-body-covid.jpg",
            publishedAt: "2020-07-27T08:07:09.1169788Z",
            content: null
        }
    };

    beforeAll(async () => {
        testApp = request(app);
        await db.Users.truncate({ force: true })
            .then(() => db.Users.createUsers([testUser]))
            .then((createdUsers) => {
                testUser.id = createdUsers[0].id;
                return authHelper(testApp, testUser);
            })
            .then((token) => {
                testUserToken = `Bearer ${token}`;
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

    describe(`# POST ${apiVersionPath}/news/:userId`, () => {
        test("should bookmark news for a user", (done) => {
            testApp
                .post(`${apiVersionPath}/news/${testUser.id}`)
                .set("Authorization", testUserToken)
                .send(postNewsBody)
                .expect(httpStatus.CREATED)
                .then(() => {
                    done();
                })
                .catch(done);
        });
    });

    describe(`# GET ${apiVersionPath}/news/:userId`, () => {
        test("should retrieved all bookmarked news for a user", (done) => {
            testApp
                .get(`${apiVersionPath}/news/${testUser.id}`)
                .set("Authorization", testUserToken)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.length).toBe(1);
                    done();
                })
                .catch(done);
        });
    });

    describe(`# DELETE ${apiVersionPath}/news/:userId`, () => {
        let testNews;
        beforeAll(async () => {
            await db.News.truncate({ force: true })
                .then(() => db.News.create(postNewsBody.news))
                .then(function (news) {
                    testNews = news;
                })
                .then(() => db.BookmarkedNews.create({ newsId: testNews.id, userId: testUser.id }));
        });
        afterAll(async () =>
            db.BookmarkedNews.truncate({ force: true }).then(() =>
                db.News.truncate({ force: true })
            )
        );
        test("should remove a bookmarked news for a user", (done) => {
            testApp
                .delete(`${apiVersionPath}/news/${testUser.id}`)
                .set("Authorization", testUserToken)
                .send({ newsId: testNews.id })
                .expect(httpStatus.OK)
                .then(() => {
                    done();
                })
                .catch(done);
        });
    });

    describe(`# POST ${apiVersionPath}/news`, () => {
        test("should get news", (done) => {
            testApp
                .post(`${apiVersionPath}/news`)
                .set("Authorization", testUserToken)
                .send(getNewsBody)
                .expect(httpStatus.OK)
                .then(() => {
                    done();
                })
                .catch(done);
        });
    });
});
