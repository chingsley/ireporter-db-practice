module.exports = {
    "extends": "airbnb-base",
    "env": {
        "node": true,
        "mocha": true
    },
    "rules": {
        "no-unused-vars": [1, { "argsIgnorePattern": "res|next|^err" }],
    }
};