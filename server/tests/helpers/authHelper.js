import config from "../../../config/config";

const apiVersionPath = `/api/v${config.apiVersion}`;

const authHelper = async (app, user) => {
    const { username, password } = user;
    return app
        .post(`${apiVersionPath}/auth/login`)
        .send({ username, password })
        .then((res) => res.body.token);
};

export default authHelper;
