module.exports = {
  plugins: {
    "posthtml-expressions": {
      locals: {
        title: "Beam",
        year: new Date().getFullYear(),
      },
    },
  },
};
