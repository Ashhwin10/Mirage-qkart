
module.exports = {
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },
  transformIgnorePatterns: [
    "node_modules/(?!@toolz/allow-react/)"
  ],
  testEnvironment: "jest-environment-jsdom",
  moduleFileExtensions: ["js", "jsx"]
};
