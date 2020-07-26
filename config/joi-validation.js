import Joi from "joi";

export default {
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
            name: Joi.string().alphanum().required(),
            password: Joi.string().required(),
            isAdmin: Joi.boolean().required()
        }
    },

    // PUT /api/users/
    updateUser: {
        body: {
            id: Joi.string().required(),
            name: Joi.string().alphanum(),
            password: Joi.string(),
            username: Joi.string().alphanum()
        }
    },

    // PUT /api/admin/users/
    updateAdmin: {
        body: {
            id: Joi.string().required(),
            name: Joi.string().alphanum(),
            password: Joi.string(),
            username: Joi.string().alphanum(),
            isAdmin: Joi.boolean()
        }
    },

    // DELETE /api/admin/users/
    deleteUser: {
        body: {
            id: Joi.string().required()
        }
    },

    // POST /api/auth/login
    login: {
        body: {
            username: Joi.string().required(),
            password: Joi.string().required()
        }
    }
};
