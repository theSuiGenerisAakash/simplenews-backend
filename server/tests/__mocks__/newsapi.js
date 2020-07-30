/* eslint-disable no-unused-vars */

// eslint-disable-next-line no-undef
let newsapi = jest.genMockFromModule("newsapi");
newsapi = function NewsAPI(_apiKey) {
    this.v2 = {
        topHeadlines: (_args) =>
            Promise.resolve({
                status: "ok",
                totalResults: 1,
                articles: [
                    {
                        source: {
                            id: "national-geographic",
                            name: "National Geographic"
                        },
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
                ]
            })
    };
};

module.exports = newsapi;
