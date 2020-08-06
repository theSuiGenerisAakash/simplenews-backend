import Joi from "joi";

const ev = require("express-validation");
// assign options
ev.options({
    flatten: true,
    allowUnknownBody: false,
    allowUnknownQuery: false,
    allowUnknownParams: false
});

const validationRules = {
    // POST /api/auth/login
    login: {
        body: {
            username: Joi.string().required(),
            password: Joi.string().required()
        }
    },

    // GET /api/admin/users/
    // GET /api/users/:id
    getUser: {
        params: {
            id: Joi.string().required()
        }
    },

    // POST /api/admin/users
    createUser: {
        body: {
            username: Joi.string().alphanum().required(),
            name: Joi.string().required(),
            password: Joi.string().required(),
            isAdmin: Joi.boolean().required()
        }
    },

    // POST /api//users
    createUserPublic: {
        body: {
            username: Joi.string().alphanum().required(),
            name: Joi.string().required(),
            password: Joi.string().required(),
            isAdmin: Joi.boolean().default(false)
        }
    },

    // PUT /api/users/
    updateUser: {
        body: {
            id: Joi.string().required(),
            name: Joi.string(),
            password: Joi.string(),
            username: Joi.string().alphanum()
        }
    },

    // PUT /api/admin/users/
    updateAdmin: {
        body: {
            id: Joi.string().required(),
            name: Joi.string(),
            password: Joi.string(),
            username: Joi.string(),
            isAdmin: Joi.boolean()
        }
    },

    // DELETE /api/admin/users/
    deleteUser: {
        body: {
            id: Joi.string().required()
        }
    },

    // POST news /api/news
    getNews: {
        body: Joi.object({
            search: Joi.string(),
            category: Joi.string().allow([
                "business",
                "entertainment",
                "general",
                "health",
                "science",
                "sports",
                "technology"
            ]),
            country: Joi.string().allow([
                "ae",
                "ar",
                "at",
                "au",
                "be",
                "bg",
                "br",
                "ca",
                "ch",
                "cn",
                "co",
                "cu",
                "cz",
                "de",
                "eg",
                "fr",
                "gb",
                "gr",
                "hk",
                "hu",
                "id",
                "ie",
                "il",
                "in",
                "it",
                "jp",
                "kr",
                "lt",
                "lv",
                "ma",
                "mx",
                "my",
                "ng",
                "nl",
                "no",
                "nz",
                "ph",
                "pl",
                "pt",
                "ro",
                "rs",
                "ru",
                "sa",
                "se",
                "sg",
                "si",
                "sk",
                "th",
                "tr",
                "tw",
                "ua",
                "us",
                "ve",
                "za"
            ]),
            page: Joi.number().default(1)
        }).min(2)
    },

    // GET /api/news/:userId
    getBookmarkedNews: {
        params: {
            userId: Joi.string().required()
        }
    },

    // POST /api/news/:userId
    bookmarkNews: {
        params: {
            userId: Joi.string().required()
        },
        news: {
            sourceId: Joi.string().allow(null).required(),
            sourceName: Joi.string().allow(null).required(),
            author: Joi.string().allow(null).required(),
            title: Joi.string().allow(null).required(),
            description: Joi.string().allow(null).required(),
            url: Joi.string().uri().allow(null).required(),
            urlToImage: Joi.string().uri().allow(null).required(),
            publishedAt: Joi.date().required(),
            content: Joi.string().allow(null).required()
        }
    },

    // DELETE /api/news/:userId
    removeBookmarkedNews: {
        params: {
            userId: Joi.string().required()
        },
        body: {
            newsId: Joi.string().required()
        }
    }
};

export { ev, validationRules };
