module.exports = {
    extends: ["airbnb-base", "plugin:prettier/recommended"],
    plugins: ["import", "prettier"],
    parser: "babel-eslint",
    rules: {
        "comma-dangle": 0,
        "prettier/prettier": "error",
        "func-names": 0
    },
    parserOptions: {
        sourceType: "module",
        ecmaVersion: 6,
        ecmaFeatures: {
            experimentalObjectRestSpread: true
        }
    }
};
