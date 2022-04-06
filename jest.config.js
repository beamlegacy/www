/* eslint-env node */

module.exports = {
  testEnvironment: "jsdom",   // To have access to browser objects like window or document
  modulePaths: ["node_modules", "src", "."],
  testMatch: ["**/?(*.)test.+(ts|js)"],
  reporters: ["default", "jest-junit"],
  transform: {"^.+\\.(ts)$": "ts-jest"},
  collectCoverageFrom: [
    "./src/**/*.{ts,js}",
    "!**/node_modules/**",
    "!**/vendor/**"
  ],
 /* roots: [
    "./src"
  ],*/
  moduleNameMapper: {
    "^.+\\.(css|scss)$": "<rootDir>/node_modules/jest-css-modules",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/fileMocks.js"
  },
  setupFiles: ["jest-canvas-mock"]
}
