module.exports = {
    transform: {
        '^.+\\.svelte$': 'svelte-jester',
        '^.+\\.js$': 'babel-jest',
    },
    transformIgnorePatterns: [
        "node_modules/?!(svelte-routing)"
    ],
    moduleFileExtensions: ['js', 'svelte'],
    setupFilesAfterEnv: [
        "./setupTest.js"
    ],
    testEnvironment: "jsdom"
}