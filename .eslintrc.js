// eslint guide http://eslint.org/docs/user-guide/configuring

module.exports = {
    "env": {
        "es6": true,
        "node": true,
        "jasmine": true
    },
    "extends": "eslint:recommended",
    "plugins": [
        "fp", "mongodb", "security"
    ],
    "rules": {
        // embrace functional programming
        "no-var": "error",
        "fp/no-class": "error",
        "fp/no-delete": "error",
        "fp/no-events": "error",
        "fp/no-let": "error",
        "fp/no-loops": "error",
        "fp/no-mutating-assign": "error",
        "fp/no-mutation": ['error', {
           exceptions: [{
               object: 'module',
               property: 'exports',
           }]
       }],
        "fp/no-nil": "error",
        //"fp/no-proxy": "error",
        "fp/no-this": "error",
        "fp/no-throw": "error",
        //"fp/no-unused-expression": "error",

        // inspect security vulnerability
        "security/detect-eval-with-expression" : "error",
        "security/detect-unsafe-regex": "error",
        "security/detect-non-literal-regexp": "error",
        "security/detect-non-literal-require": "error",
        "security/detect-non-literal-fs-filename": "error",
        "security/detect-eval-with-expression": "error",
        "security/detect-pseudoRandomBytes": "error",
        "security/detect-possible-timing-attacks": "error",
        "security/detect-no-csrf-before-method-override": "error",
        "security/detect-buffer-noassert": "error",
        "security/detect-child-process": "error",
        "security/detect-disable-mustache-escape": "error",
        "security/detect-object-injection": "error",
        "security/detect-new-buffer": "error",

        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ]
    }
};
