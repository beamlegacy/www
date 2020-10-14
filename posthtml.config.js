module.exports = {
  plugins: {
    "posthtml-expressions": {
      locals: {
        title: "Beam",
        description:
          "Comming soon to your Mac, a new way to collect your thoughts and experience the internet.",
        url: "https://beamapp.co/",
        twitter: "getonbeam",
        year: new Date().getFullYear(),
      },
    },
  },
};
