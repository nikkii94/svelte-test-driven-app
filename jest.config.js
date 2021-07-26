module.exports = {
    transform: {
        "^.+\\.js$": "babel-jest",
        "^.+\\.svelte$": "svelte-jester"
    },
    setupFilesAfterEnv: [
        "./setupTest.js"
    ],
    moduleDirectories: ["node_modules", "src"],
    testPathIgnorePatterns: ["node_modules"],
    bail: false,
    verbose: true,
    transformIgnorePatterns: ["node_modules"],
    moduleFileExtensions: [
        "js",
        "svelte"
    ],
    testEnvironment: "jsdom"
}