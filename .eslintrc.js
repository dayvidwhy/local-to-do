module.exports = {
    "root": true,
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "extends": [
        "eslint:recommended"
    ],
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "ignorePatterns": ["**/docs/*"],
    "rules": {
        "quotes": ["error", "double"],
        "indent": ["error", 4]
    },
    "plugins": [
        "svelte3"
    ],
    "overrides": [
        {
            files: ["*.svelte"],
            processor: "svelte3/svelte3"
        }
    ],
    "settings": {
        "react": {
            "version": "detect"
        }
    }
};
