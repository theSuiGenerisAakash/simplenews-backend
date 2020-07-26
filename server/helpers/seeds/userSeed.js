/* eslint-disable no-unused-vars */

module.exports = {
    up(db) {
        return db.Users.createUsers([
            {
                name: "Aakash",
                username: "AakashV",
                password: "P@ssw0rd",
                isAdmin: true
            },
            {
                name: "Aaditesh",
                username: "AadiV",
                password: "P@ssw0rd1",
                isAdmin: true
            },
            {
                name: "Imastia",
                username: "ImastiaN",
                password: "P@ssw0rd2",
                isAdmin: false
            }
        ]);
    },

    down(db) {
        return db.Users.deleteUsers([
            { username: "AakashV" },
            { username: "AadiV" },
            { username: "ImastiaN" }
        ]);
    }
};
